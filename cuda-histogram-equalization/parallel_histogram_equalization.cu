#include <stdlib.h>
#include <math.h>
#include <cuda_runtime.h>
#include <cuda.h>
#include "include/helper_cuda.h"

#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "include/stb_image.h"
#include "include/stb_image_write.h"

#define GRAYLEVELS 256
#define COLOR_CHANNELS 1
#define DESIRED_NCHANNELS 1

#define N 1 

//#define PRINT_HISTOGRAMS

//#define CDF_NAIVE
#define CDF_WE
//#define CDF_WE_MBCDF

#ifdef CDF_WE_MBCF 
    #define NUM_BANKS 16
    #define LOG_NUM_BANKS 4
    #define CONFLICT_FREE_OFFSET(n) (((n) >> NUM_BANKS) + ((n) >> (2 * LOG_NUM_BANKS)))
#endif  // PARALLEL_CDF_WE_MBCF

__global__ void findMinKernel(unsigned int* cdf, unsigned int*d_cdfmin) {
    // Allocate shared memory
	__shared__ unsigned int partial_mins[256];

	// Calculate thread ID
	int tid = threadIdx.x;
    // Load elements into shared memory
    // we are looking for the smallest NON-ZERO value in CDF so we can UINT_MAX all the zeros
    if (tid < 128) {
	    partial_mins[tid] = cdf[tid] == 0 ? UINT_MAX : cdf[tid];
        partial_mins[tid + 128] = cdf[tid + 128] == 0 ? UINT_MAX : cdf[tid + 128];
    }   
    // Start at 1/2 block stride and divide by two each iteration
	for (int s = GRAYLEVELS/2; s > 0; s >>= 1) {
        __syncthreads();
		// Each thread does work unless it is further than the stride
		if (tid < s) {
		    partial_mins[tid] = min(partial_mins[tid], partial_mins[tid + s]); 
	    }
	}
    __syncthreads();
	if (threadIdx.x == 0) {
        *d_cdfmin = partial_mins[0];
	}
}




/**************1st step: CALCULATE HISTOGRAM ****************/

/*************** KERNEL FOR CALCULATING HISTOGRAM "LOCALLY" ***************/
// each block (16*16)threads, calculates its local histogram
// then the local histograms are summed to get the global histogram
__global__ void CalculateHistogramKernel(unsigned char* image, int width, int height, unsigned int *histogram){
   
    // calculate global x, y of pixel on image
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;

    // calculate local x, y of pixel in block 
    int lx = threadIdx.x;
    int ly = threadIdx.y;

    // allocate local memory for local histogram for each block
    __shared__ unsigned int localHistogram[GRAYLEVELS];

    // each thread sets its pixel in local histogram to 0 
    localHistogram[blockDim.x * ly + lx] = 0;
    __syncthreads();

    //read value from image and increment local histogram
    if (x < width && y < height) {
        atomicAdd(&(localHistogram[image[y * width + x]]), 1);
    }
    __syncthreads();
    // now we have a calculation of local histogram

    // now each threadd takes its own beam to global memory, because neighbour threads take neighbour beams to
    // neighbouring memory locations in global memory, we can combine memory accesses (memory coalescing)
    atomicAdd(&(histogram[ly * blockDim.x + lx]), localHistogram[ly * blockDim.x + lx]);
}

#ifdef CDF_NAIVE
/*************** NAIVE KERNEL FOR PARALLEL CDF CLALCULATION ***************/
__global__ void CalculateCDF_naive(unsigned int* histogram, unsigned int *cdf) {
    __shared__ unsigned int temp[GRAYLEVELS*2];
    int tid = threadIdx.x;

    int pout = 0, pin = 1;

    temp[tid] = histogram[tid];

    __syncthreads();

    for(int offset = 1; offset < GRAYLEVELS; offset <<= 1) {
        pout = 1 - pout;
        pin = 1 - pout;
        if (tid >= offset) {
            temp[pout*GRAYLEVELS + tid] = temp[pin*GRAYLEVELS + tid] + temp[pin*GRAYLEVELS + tid - offset];
        } else {
            temp[pout*GRAYLEVELS + tid] = temp[pin*GRAYLEVELS + tid];
        }
        __syncthreads();
    }
    cdf[tid] = temp[pout*GRAYLEVELS + tid];
}
#endif  // CDF_NAIVE

#ifdef CDF_WE
/*************** WORK EFFICIENT KERNEL FOR PARALLEL CDF CLALCULATION ***************/
// code for work efficient parallel cdf, based on the following source:
// https://developer.nvidia.com/gpugems/gpugems3/part-vi-gpu-computing/chapter-39-parallel-prefix-sum-scan-cuda
__global__ void CalculateCDF_we(unsigned int* histogram, unsigned int*cdf) {
    __shared__ unsigned int temp[GRAYLEVELS];

    int tid = threadIdx.x; // 1block 1x128 threads, 128 threads 
    int offset = 1; // distance between elements in array that will be summed

    // the sum of values, that each thredad calculates in 1st step
    temp[2*tid] = histogram[2*tid];
    temp[2*tid+1] = histogram[2*tid+1];


    for (int d = GRAYLEVELS >> 1; d > 0; d >>= 1) {
        __syncthreads();

        if (tid < d) {
            int ai = offset*(2*tid+1)-1;
            int bi = offset*(2*tid+2)-1;
            temp[bi] += temp[ai];
        }
        offset *= 2;
    }

    if (tid == 0) {
        temp[GRAYLEVELS - 1] = 0;
    }
    
    for (int d = 1; d < GRAYLEVELS; d *= 2) {
        offset >>= 1;
        __syncthreads();

        if (tid < d) {
            int ai = offset*(2*tid+1)-1;
            int bi = offset*(2*tid+2)-1;

            float t = temp[ai];
            temp[ai] = temp[bi];
            temp[bi] += t;
        }
    }
    __syncthreads();
    cdf[2*tid] = temp[2*tid];
    cdf[2*tid+1] = temp[2*tid+1];
}
#endif  // CDF_WE

#ifdef CDF_WE_MBCF
/*************** WORK EFFICIENT KERNEL FOR PARALLEL CDF CLALCULATION WITHOUT MEMORY BANK COFNILCTS***************/
/* 
    need to figure out, why calculated cdf values are higher than they should be,
    outputed image still seems to be equalized correctly
*/ 
__global__ void CalculateCDF_we_mbcf(unsigned int* histogram, unsigned int *cdf) {
    __shared__ unsigned int temp[GRAYLEVELS + CONFLICT_FREE_OFFSET(GRAYLEVELS)];

    int tid = threadIdx.x; // 1block 1x128 threads, 128 threads 
    int offset = 1; // distance between elements in array that will be summed

    int ai= 2*tid;
    int bi= tid + (GRAYLEVELS/2);
    int bankOffsetA = CONFLICT_FREE_OFFSET(ai);
    int bankOffsetB = CONFLICT_FREE_OFFSET(bi);
    
    temp[ai + bankOffsetA] = histogram[ai];
    temp[bi + bankOffsetB] = histogram[bi];

    // the sum of values, that each thredad calculates in 1st step

    for (int d = GRAYLEVELS >> 1; d > 0; d >>= 1) {
        __syncthreads();

        if (tid < d) {
            ai = offset*(2*tid+1)-1;
            bi = offset*(2*tid+2)-1;
            temp[bi] += temp[ai];
        }
        offset *= 2;
    }

    if (tid == 0) {
        temp[GRAYLEVELS - 1 + CONFLICT_FREE_OFFSET(GRAYLEVELS - 1)] = 0;
    }
    
    for (int d = 1; d < GRAYLEVELS; d *= 2) {
        offset >>= 1;
        __syncthreads();

        if (tid < d) {
            ai = offset*(2*tid+1)-1;
            bi = offset*(2*tid+2)-1;

            float t = temp[ai];
            temp[ai] = temp[bi];
            temp[bi] += t;
        }
    }
    __syncthreads();
    cdf[ai] = temp[ai + bankOffsetA];
    cdf[bi] = temp[bi + bankOffsetB];
}
#endif  // CDF_WE_MBCF



__device__ unsigned char scale(unsigned int cdf, unsigned int cdfmin, unsigned int imageSize) {
    float scale;
    scale = (float)(cdf - cdfmin) / (float)(imageSize - cdfmin);
    scale = round(scale * (float)(GRAYLEVELS-1));
    return (int)scale;
}


/**************3rd step: EQUALIZE ****************/
__global__ void EqualizeKernel(unsigned char * image_in, unsigned char * image_out, int width, int height, unsigned int *cdf, unsigned int *cdfmin) {
    unsigned int imageSize = width * height;
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    
    //Equalize
    if (x < width && y < height){
        image_out[(y*width + x)] = scale(cdf[image_in[y*width + x]], *cdfmin, imageSize);
    }
}

void printHistogram(unsigned int* histogram) {
    printf("[");
    for (int i=0; i<GRAYLEVELS; i++) {
        if (i == GRAYLEVELS-1){
            printf("%d]\n", histogram[i]);
            return;
        }   
        printf("%d, ", histogram[i]);
    }
}

unsigned char Scale(unsigned int cdf, unsigned int cdfmin, unsigned int imageSize){
    float scale;
    scale = (float)(cdf - cdfmin) / (float)(imageSize - cdfmin);
    scale = round(scale * (float)(GRAYLEVELS-1));
    return (int)scale;
}
void Equalize(unsigned char *image_in, unsigned char *image_out, int width, int height, unsigned int *cdf){
    unsigned int imageSize = width * height;
    unsigned int cdfmin = 2; 
    //Equalize: namig: blok niti naj si CDF naloži v skupni pomnilnik
    for (int i=0; i<height; i++) {
        for (int j=0; j<width; j++) {
            image_out[(i*width + j)] = Scale(cdf[image_in[i*width + j]], cdfmin, imageSize);
        }
    }
}

int main(int argc, char *argv[]) {
    
    char imageInName[255]; char imageoutNamePNG[255]; char imageoutNameJPG[255]; char imageInFormat[5];
    snprintf(imageInName, 255, "%s", argv[1]);
    snprintf(imageInFormat, 5, "%s", argv[2]); 
    strncat(imageInName, imageInFormat, 4);
    snprintf(imageoutNamePNG, 255, "%s", argv[1]); snprintf(imageoutNameJPG, 255, "%s", argv[1]);
    strncat(imageoutNamePNG, "_out.png", 12); strncat(imageoutNameJPG, "_out.jpg", 12);

    // Read image from file
    int width, height, cpp;
    // read only DESIRED_NCHANNELS channels from the input image:
    unsigned char *h_imageIn = stbi_load(imageInName, &width, &height, &cpp, DESIRED_NCHANNELS);
    if(h_imageIn == NULL) {
        printf("Error in loading the image\n");
        return 1;
    }
    printf("Loaded image W = %d, H = %d, actual cpp = %d \n", width, height, cpp);
	
    //Allocate memory for raw output image data, histogram, and CDF 
    unsigned char *h_imageOut = (unsigned char *)malloc(width * height * sizeof(unsigned char));
	unsigned int *h_histogram = (unsigned int *)malloc(GRAYLEVELS * sizeof(unsigned int));
    unsigned int *h_cdf = (unsigned int *)malloc(GRAYLEVELS * sizeof(unsigned int));
    unsigned int *h_cdfmin = (unsigned int *)malloc(sizeof(unsigned int));
    

    dim3 blockSize(16, 16);
    dim3 gridSize(ceil((float) width / blockSize.x), ceil((float) height / blockSize.y));
    unsigned int *d_histogram;
    unsigned char *d_imageIn;
    unsigned char *d_imageOut;
    unsigned int *d_cdf;
    unsigned int *d_cdfmin;
    cudaMalloc(&d_histogram, GRAYLEVELS * sizeof(unsigned int));
    cudaMalloc(&d_imageIn, width * height * sizeof(unsigned char));
    cudaMalloc(&d_imageOut, width * height * sizeof(unsigned char));
    cudaMalloc(&d_cdf, GRAYLEVELS * sizeof(unsigned int));
    cudaMalloc(&d_cdfmin, sizeof(unsigned int));

    //timestart
    cudaEvent_t start, stop;
    cudaEventCreate(&start);
    cudaEventCreate(&stop);
    cudaEventRecord(start);
    float milliseconds = 0;

	// Histogram equalization steps: 
	// 1. Create the histogram for the input grayscale image.
    cudaMemcpy(d_imageIn, h_imageIn, width * height * sizeof(unsigned char), cudaMemcpyHostToDevice);
    
    for (int n = 0; n < N; n++){

        CalculateHistogramKernel<<<gridSize, blockSize>>>(d_imageIn, width, height, d_histogram);
        #ifdef PRINT_HISTOGRAMS
            cudaMemcpy(h_histogram, d_histogram, GRAYLEVELS * sizeof(unsigned int), cudaMemcpyDeviceToHost);
            printf("INITIAL HISTOGRAM \n");
            printHistogram(h_histogram);
            printf("\n");
        #endif  // PRINT_HISTOGRAMS

	    //  2. Calculate the cumulative distribution histogram.
        #ifdef CDF_NAIVE
        CalculateCDF_naive<<<1, 256>>>(d_histogram, d_cdf);
        #endif  // CDF_NAIVE

        #ifdef CDF_WE
        CalculateCDF_we<<<1, 128>>>(d_histogram, d_cdf);
        #endif  // CDF_WE

        #ifdef CDF_WE_MBCF
        CalculateCDF_we_mbcf<<<1, 128>>>(d_histogram, d_cdf);
        #endif  // CDF_WE_MBCF
    
	    //  3. Calculate the new gray-level values through the general histogram equalization formula and assign new pixel values
        findMinKernel<<<1, 128>>>(d_cdf, d_cdfmin);
        cudaMemcpy(h_cdfmin, d_cdfmin, sizeof(unsigned int), cudaMemcpyDeviceToHost);
        //printf("CDFMIN: %d\n", *h_cdfmin);
        //cudaMemcpy(h_cdf, d_cdf, GRAYLEVELS * sizeof(unsigned int), cudaMemcpyDeviceToHost);

        EqualizeKernel<<<gridSize, blockSize>>>(d_imageIn, d_imageOut, width, height, d_cdf, d_cdfmin);
        //Equalize(h_imageIn, h_imageOut, width, height, h_cdf);
        cudaMemcpy(h_imageOut, d_imageOut, height * width * sizeof(unsigned char), cudaMemcpyDeviceToHost);
    
        #ifdef PRINT_HISTOGRAMS
            printf("CDF\n");
            cudaMemcpy(h_cdf, d_cdf, GRAYLEVELS * sizeof(unsigned int), cudaMemcpyDeviceToHost);
            printHistogram(h_cdf);
            printf("\n");
            CalculateHistogramKernel<<<gridSize, blockSize>>>(d_imageOut, width, height, d_histogram);
            cudaMemcpy(h_histogram, d_histogram, GRAYLEVELS * sizeof(unsigned int), cudaMemcpyDeviceToHost);
            printf("EQUALIZED HISTOGRAM \n");
            printHistogram(h_histogram);
        #endif  // PRINT_HISTOGRAMS
    }

    //time stop
    cudaEventRecord(stop);
    cudaEventSynchronize(stop);
    cudaEventElapsedTime(&milliseconds, start, stop);
    printf("Kernel Execution time is: %0.4f milliseconds \n", milliseconds/N);


    //Free cuda memory
    cudaFree(d_histogram);
    cudaFree(d_imageIn);
    cudaFree(d_imageOut);
    cudaFree(d_cdf);
    cudaFree(d_cdfmin);

    // write output image:
    stbi_write_png(imageoutNamePNG, width, height, DESIRED_NCHANNELS, h_imageOut, width * DESIRED_NCHANNELS);
    stbi_write_jpg(imageoutNameJPG, width, height, DESIRED_NCHANNELS, h_imageOut, 100);
    //stbi_write_jpg("out.jpg", width, height, DESIRED_NCHANNELS, h_imageOut, 100);

	//Free memory
	free(h_imageIn);
    free(h_imageOut);
	free(h_histogram);
    free(h_cdf);

    

	return 0;
}

