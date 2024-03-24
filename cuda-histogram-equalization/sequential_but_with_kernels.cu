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

#define PRINT_HISTOGRAMS

//#define CDF_NAIVE
#define CDF_WE
//#define CDF_WE_MBCDF

#ifdef CDF_WE_MBCF 
    #define NUM_BANKS 16
    #define LOG_NUM_BANKS 4
    #define CONFLICT_FREE_OFFSET(n) (((n) >> NUM_BANKS) + ((n) >> (2 * LOG_NUM_BANKS)))
#endif  // PARALLEL_CDF_WE_MBCF

__global__ void findMinKernel(unsigned int* cdf, unsigned int*d_cdfmin) {
    if (threadIdx.x == 0) {
        unsigned int min = 0;
        // grem skozi CDF dokler ne najdem prvi nenicelni element ali pridem do konca
        for (int i = 0; min == 0 && i < GRAYLEVELS; i++) {
		    min = cdf[i];
        }
    
        *d_cdfmin = min;
    }



}

/**************1st step: CALCULATE HISTOGRAM ****************/

/*************** KERNEL FOR CALCULATING HISTOGRAM "LOCALLY" ***************/
// each block (16*16)threads, calculates its local histogram
// then the local histograms are summed to get the global histogram
__global__ void CalculateHistogramKernel(unsigned char* image, int width, int height, unsigned int *histogram){
   if (threadIdx.x == 0) {
        for (int i=0; i<height; i++) {
            for (int j=0; j<width; j++) {
                histogram[image[i*width + j]]++;
            }
        }
    }
}



#ifdef CDF_WE
/*************** WORK EFFICIENT KERNEL FOR PARALLEL CDF CLALCULATION ***************/
// code for work efficient parallel cdf, based on the following source:
// https://developer.nvidia.com/gpugems/gpugems3/part-vi-gpu-computing/chapter-39-parallel-prefix-sum-scan-cuda
__global__ void CalculateCDF_we(unsigned int* histogram, unsigned int*cdf) {
    if (threadIdx.x == 0) {
        // clear cdf:
        for (int i=0; i<GRAYLEVELS; i++) {
            cdf[i] = 0;
        }
        // calculate cdf from histogram
        cdf[0] = histogram[0];
        for (int i=1; i<GRAYLEVELS; i++) {
            cdf[i] = cdf[i-1] + histogram[i];
        }
    }
}
#endif  // CDF_WE





__device__ unsigned char scale(unsigned int cdf, unsigned int cdfmin, unsigned int imageSize) {
    float scale;
    scale = (float)(cdf - cdfmin) / (float)(imageSize - cdfmin);
    scale = round(scale * (float)(GRAYLEVELS-1));
    return (int)scale;
}


/**************3rd step: EQUALIZE ****************/
__global__ void EqualizeKernel(unsigned char * image_in, unsigned char * image_out, int width, int height, unsigned int *cdf, unsigned int *cdfmin) {
    if (threadIdx.x == 0) {
        unsigned int imageSize = width * height;
        //Equalize: namig: blok niti naj si CDF naloži v skupni pomnilnik
        for (int i=0; i<height; i++) {
            for (int j=0; j<width; j++) {
                image_out[(i*width + j)] = scale(cdf[image_in[i*width + j]], *cdfmin, imageSize);
            }
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

        CalculateHistogramKernel<<<1, 1>>>(d_imageIn, width, height, d_histogram);
       
        

        #ifdef CDF_WE
        CalculateCDF_we<<<1, 1>>>(d_histogram, d_cdf);
        #endif  // CDF_WE

       
    
	    //  3. Calculate the new gray-level values through the general histogram equalization formula and assign new pixel values
        findMinKernel<<<1, 1>>>(d_cdf, d_cdfmin);
        cudaMemcpy(h_cdfmin, d_cdfmin, sizeof(unsigned int), cudaMemcpyDeviceToHost);
        //printf("CDFMIN: %d\n", *h_cdfmin);
        //cudaMemcpy(h_cdf, d_cdf, GRAYLEVELS * sizeof(unsigned int), cudaMemcpyDeviceToHost);

        EqualizeKernel<<<gridSize, blockSize>>>(d_imageIn, d_imageOut, width, height, d_cdf, d_cdfmin);
        //Equalize(h_imageIn, h_imageOut, width, height, h_cdf);
        cudaMemcpy(h_imageOut, d_imageOut, height * width * sizeof(unsigned char), cudaMemcpyDeviceToHost);
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

