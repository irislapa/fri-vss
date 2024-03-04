
#ifndef __AUDIO_H
#define __AUDIO_H

#include "main.h"
#include "pdm2pcm.h"
#include "pdm2pcm_glo.h"
#include "stm32h7xx_hal_sai.h"
#include "stm32h7xx_hal_dma.h"

#define BUFFER_SIZE 1024
#define AUDIO_FREQUENCY_11K 11025U
#define AUDIO_FREQUENCY_16K 16000U
#define AUDIO_FREQUENCY_22K 22050U
#define AUDIO_FREQUENCY_44K 44100U
//#define UNUSED(x) ((void)(x))

extern volatile uint16_t pdm_buffer[BUFFER_SIZE];
extern volatile uint16_t pcm_buffer[BUFFER_SIZE];
extern SAI_HandleTypeDef hsai_BlockA4;
extern DMA_HandleTypeDef hdma_saia4;


HAL_StatusTypeDef MX_SAI4_ClockConfig(uint32_t SampleRate);
void MX_SAI4_Init();
void HAL_SAI_MspInit();
void HAL_SAI_MspDeInit();
uint32_t audio_Init();

void HAL_SAI_TxCpltCallback(SAI_HandleTypeDef *hsai);
void HAL_SAI_TxHalfCpltCallback(SAI_HandleTypeDef *hsai);
void HAL_SAI_RxCpltCallback(SAI_HandleTypeDef *hsai);
void HAL_SAI_RxHalfCpltCallback(SAI_HandleTypeDef *hsai);
void HAL_SAI_ErrorCallback(SAI_HandleTypeDef *hsai);

#endif /*__AUDIO_H */
