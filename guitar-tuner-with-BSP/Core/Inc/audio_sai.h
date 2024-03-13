/**
 ******************************************************************************
 * @file           : audio_sai.h
 * @brief          : Header for audio.c file.
 *                   This file contains the common defines of the application.
 * @author         : Irinej Slapal
 * @date           : 12-Dec-2023
 *
 * @note           : This file provides definitions for the audio processing
 *                   functions and the SAI interface initialization for the
 *                   STM32F750BDK Discovery board.
 *
 * @revision       : 1.0
 * @last_modified  : 12-Dec-2023
 ******************************************************************************
 */


#ifndef AUDIO_SAI
#define AUDIO_SAI

#include "stm32h7xx_hal.h"
#include "stm32h7xx_hal_sai.h"
#include "stm32h7xx_hal_dma.h"

#define SAMPLE_RATE 16000U
#define BUFFER_SIZE 1024
/*

 * Buffer Size (bytes) = (Sample Rate x Buffer Duration x Bit Depth x Channels) / 8

 * Buffer Size = (44100 samples/second x 0.1 seconds x 16 bits/sample x 2 channels) / 8 bits/byte
            ≈ 1764 bytes
*/


extern volatile uint16_t audioBuffer[];

//static uint16_t DMAbuffer1[BUFFER_SIZE];
//static uint16_t DMAbuffer2[BUFFER_SIZE];

extern SAI_HandleTypeDef hsai_BlockA2;
extern DMA_HandleTypeDef hdma_sai_rx;
extern volatile uint32_t audioDelayTime; // Default delay of 500 ms


static void MX_SAI1_Init(void);
static void MX_DMA1_Init(void);
void Audio_Init(void);

extern void ErrorHandler(void);
HAL_StatusTypeDef StartAudioDMA(void);

SAI_HandleTypeDef hsai_BlockA2;
SAI_HandleTypeDef hsai_BlockB2;




#endif // AUDIO_SAI
