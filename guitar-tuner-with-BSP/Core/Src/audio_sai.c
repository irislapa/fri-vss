
/**
 ******************************************************************************
 * @file           : audio_sai.c
 * @brief          : Audio processing and SAI interface handling
 * @author         : Irinej Slapal
 * @date           : 12-Dec-2023
 *
 * @note           : This file contains the implementation of the functions
 *                   for audio data acquisition and processing using the MEMS
 *                   microphone and SAI interface on the STM32F750BDK board.
 *
 * @revision       : 1.0
 * @last_modified  : 12-Dec-2023
 ******************************************************************************
 */



/*
#ifndef STD_INT_LIB
	#define STD_INT_LIB
	#include <stdint.h>
#endif
*/

#include "audio_sai.h"

#ifndef METH
	#define METH
	#include <math.h>
#endif


SAI_HandleTypeDef hsai_BlockA1;
SAI_HandleTypeDef hsai_BlockB1;
DMA_HandleTypeDef hdma_sai_rx;

volatile uint16_t audioBuffer[BUFFER_SIZE];


void Audio_Init() {
	MX_SAI1_Init();
	MX_DMA1_Init();
}

/**
  * @brief SAI1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_SAI2_Init() {
  hsai_BlockA1.Instance = SAI2_Block_A;
  hsai_BlockA1.Init.AudioMode = SAI_MODEMASTER_TX;
  hsai_BlockA1.Init.Synchro = SAI_ASYNCHRONOUS;
  hsai_BlockA1.Init.OutputDrive = SAI_OUTPUTDRIVE_DISABLE;
  hsai_BlockA1.Init.NoDivider = SAI_MASTERDIVIDER_ENABLE;
  hsai_BlockA1.Init.FIFOThreshold = SAI_FIFOTHRESHOLD_EMPTY;
  hsai_BlockA1.Init.AudioFrequency = SAI_AUDIO_FREQUENCY_192K;
  hsai_BlockA1.Init.SynchroExt = SAI_SYNCEXT_DISABLE;
  hsai_BlockA1.Init.MonoStereoMode = SAI_STEREOMODE;
  hsai_BlockA1.Init.CompandingMode = SAI_NOCOMPANDING;
  hsai_BlockA1.Init.TriState = SAI_OUTPUT_NOTRELEASED;
  hsai_BlockA1.Init.AudioFrequency = SAMPLE_RATE;
  if (HAL_SAI_InitProtocol(&hsai_BlockA2, SAI_I2S_STANDARD, SAI_PROTOCOL_DATASIZE_16BIT, 2) != HAL_OK)
  {
    Error_Handler();
  }
}

static void MX_DMA2_Init() {
	__HAL_RCC_DMA1_CLK_ENABLE(); // Replace DMAx with the actual DMA, e.g., DMA1

     // Initialize the DMA handle
    hdma_sai_rx.Instance = DMA2_Stream3;
    hdma_sai_rx.Init.Request = DMA_REQUEST_SAI1_A;
    hdma_sai_rx.Init.Direction = DMA_PERIPH_TO_MEMORY;
    hdma_sai_rx.Init.PeriphInc = DMA_PINC_DISABLE;
    hdma_sai_rx.Init.MemInc = DMA_MINC_ENABLE;
    hdma_sai_rx.Init.PeriphDataAlignment = DMA_PDATAALIGN_HALFWORD;
    hdma_sai_rx.Init.MemDataAlignment = DMA_MDATAALIGN_HALFWORD;
    hdma_sai_rx.Init.Mode = DMA_CIRCULAR;
    hdma_sai_rx.Init.Priority = DMA_PRIORITY_HIGH;
    hdma_sai_rx.Init.FIFOMode = DMA_FIFOMODE_DISABLE;


    if (HAL_DMA_Init(&hdma_sai_rx) != HAL_OK) {
    	// Initialization Error Handling
    	Error_Handler();
    }

    //HAL_DMAEx_MultiBufferStart(&hdma_sai_rx, (uint32_t)&SAI1_Block_A->DR, (uint32_t)buffer1, (uint32_t)buffer2, BUFFER_SIZE);

    __HAL_LINKDMA(&hsai_BlockA1, hdmarx, hdma_sai_rx);


    HAL_NVIC_SetPriority(DMA2_Stream3_IRQn, 15, 0);
    HAL_NVIC_EnableIRQ(DMA2_Stream3_IRQn);
}

//// SAI Rx Complete Callback
//void HAL_SAI_RxCpltCallback(SAI_HandleTypeDef *hsai) {
//    if (hsai != &hsai_BlockA1) return;
//    processBufferData();
//}
//
//// SAI Rx Half Complete Callback
//void HAL_SAI_RxHalfCpltCallback(SAI_HandleTypeDef *hsai) {
//	if (hsai != &hsai_BlockA1) return;
//}


void processBufferData() {
	audioDelayTime = 500-(100 * calculateRMS(&audioBuffer, BUFFER_SIZE));
}


HAL_StatusTypeDef StartAudioDMA() {
    return HAL_SAI_Receive_DMA(&hsai_BlockA1, (uint8_t *)audioBuffer, BUFFER_SIZE);
}

/***************AUDIO PROCESSING***************/
int calculateRMS(int *audioBuffer, int bufferSize) {
    long sumOfSquares = 0;
    for (int i = 0; i < bufferSize; i++) {
        sumOfSquares += audioBuffer[i] * audioBuffer[i];
    }
    double mean = (double)sumOfSquares / bufferSize;
    return (int)sqrt(mean);
}



//
//static void MX_SAI2_Init(void)
//{
//
//  /* USER CODE BEGIN SAI2_Init 0 */
//
//  /* USER CODE END SAI2_Init 0 */
//
//  /* USER CODE BEGIN SAI2_Init 1 */
//
//  /* USER CODE END SAI2_Init 1 */
//  hsai_BlockA2.Instance = SAI2_Block_A;
//  hsai_BlockA2.Init.Protocol = SAI_FREE_PROTOCOL;
//  hsai_BlockA2.Init.AudioMode = SAI_MODEMASTER_TX;
//  hsai_BlockA2.Init.DataSize = SAI_DATASIZE_8;
//  hsai_BlockA2.Init.FirstBit = SAI_FIRSTBIT_MSB;
//  hsai_BlockA2.Init.ClockStrobing = SAI_CLOCKSTROBING_FALLINGEDGE;
//  hsai_BlockA2.Init.Synchro = SAI_ASYNCHRONOUS;
//  hsai_BlockA2.Init.OutputDrive = SAI_OUTPUTDRIVE_DISABLE;
//  hsai_BlockA2.Init.NoDivider = SAI_MASTERDIVIDER_ENABLE;
//  hsai_BlockA2.Init.FIFOThreshold = SAI_FIFOTHRESHOLD_EMPTY;
//  hsai_BlockA2.Init.AudioFrequency = SAI_AUDIO_FREQUENCY_192K;
//  hsai_BlockA2.Init.SynchroExt = SAI_SYNCEXT_DISABLE;
//  hsai_BlockA2.Init.MonoStereoMode = SAI_STEREOMODE;
//  hsai_BlockA2.Init.CompandingMode = SAI_NOCOMPANDING;
//  hsai_BlockA2.Init.TriState = SAI_OUTPUT_NOTRELEASED;
//  hsai_BlockA2.Init.PdmInit.Activation = DISABLE;
//  hsai_BlockA2.Init.PdmInit.MicPairsNbr = 1;
//  hsai_BlockA2.Init.PdmInit.ClockEnable = SAI_PDM_CLOCK1_ENABLE;
//  hsai_BlockA2.FrameInit.FrameLength = 8;
//  hsai_BlockA2.FrameInit.ActiveFrameLength = 1;
//  hsai_BlockA2.FrameInit.FSDefinition = SAI_FS_STARTFRAME;
//  hsai_BlockA2.FrameInit.FSPolarity = SAI_FS_ACTIVE_LOW;
//  hsai_BlockA2.FrameInit.FSOffset = SAI_FS_FIRSTBIT;
//  hsai_BlockA2.SlotInit.FirstBitOffset = 0;
//  hsai_BlockA2.SlotInit.SlotSize = SAI_SLOTSIZE_DATASIZE;
//  hsai_BlockA2.SlotInit.SlotNumber = 1;
//  hsai_BlockA2.SlotInit.SlotActive = 0x00000000;
//  if (HAL_SAI_Init(&hsai_BlockA2) != HAL_OK)
//  {
//    Error_Handler();
//  }
//  hsai_BlockB2.Instance = SAI2_Block_B;
//  hsai_BlockB2.Init.Protocol = SAI_FREE_PROTOCOL;
//  hsai_BlockB2.Init.AudioMode = SAI_MODESLAVE_RX;
//  hsai_BlockB2.Init.DataSize = SAI_DATASIZE_8;
//  hsai_BlockB2.Init.FirstBit = SAI_FIRSTBIT_MSB;
//  hsai_BlockB2.Init.ClockStrobing = SAI_CLOCKSTROBING_FALLINGEDGE;
//  hsai_BlockB2.Init.Synchro = SAI_SYNCHRONOUS;
//  hsai_BlockB2.Init.OutputDrive = SAI_OUTPUTDRIVE_DISABLE;
//  hsai_BlockB2.Init.FIFOThreshold = SAI_FIFOTHRESHOLD_EMPTY;
//  hsai_BlockB2.Init.SynchroExt = SAI_SYNCEXT_DISABLE;
//  hsai_BlockB2.Init.MonoStereoMode = SAI_STEREOMODE;
//  hsai_BlockB2.Init.CompandingMode = SAI_NOCOMPANDING;
//  hsai_BlockB2.Init.TriState = SAI_OUTPUT_NOTRELEASED;
//  hsai_BlockB2.Init.PdmInit.Activation = DISABLE;
//  hsai_BlockB2.Init.PdmInit.MicPairsNbr = 1;
//  hsai_BlockB2.Init.PdmInit.ClockEnable = SAI_PDM_CLOCK1_ENABLE;
//  hsai_BlockB2.FrameInit.FrameLength = 8;
//  hsai_BlockB2.FrameInit.ActiveFrameLength = 1;
//  hsai_BlockB2.FrameInit.FSDefinition = SAI_FS_STARTFRAME;
//  hsai_BlockB2.FrameInit.FSPolarity = SAI_FS_ACTIVE_LOW;
//  hsai_BlockB2.FrameInit.FSOffset = SAI_FS_FIRSTBIT;
//  hsai_BlockB2.SlotInit.FirstBitOffset = 0;
//  hsai_BlockB2.SlotInit.SlotSize = SAI_SLOTSIZE_DATASIZE;
//  hsai_BlockB2.SlotInit.SlotNumber = 1;
//  hsai_BlockB2.SlotInit.SlotActive = 0x00000000;
//  if (HAL_SAI_Init(&hsai_BlockB2) != HAL_OK)
//  {
//    Error_Handler();
//  }
//  /* USER CODE BEGIN SAI2_Init 2 */
//
//  /* USER CODE END SAI2_Init 2 */
//
//}


