/**
 ******************************************************************************
 * @file           : record.h
 * @brief          : Header for record.c file.
 *
 * @author         : Irinej Slapal
 * @date           : 29-Dec-2023
 *
 * @note           : This file contains defines and prototypes for capturing audio input
 *                   using the BSP driver
 *
 * @revision       : 1.0
 * @last_modified  : 29-Dec-2023
 ******************************************************************************
 */


#ifndef RECORD_H
#define RECORD_H

#include "stm32h7xx_hal.h"
#include "stm32h750b_discovery_audio.h"
#include "stdio.h"

#define AUDIO_FREQUENCY            16000U

#define AUDIO_IN_PDM_BUFFER_SIZE  (uint32_t)(128*AUDIO_FREQUENCY/16000*2)
#define AUDIO_BUFF_SIZE  4096
#define AUDIO_NB_BLOCKS    ((uint32_t)4)
#define AUDIO_VOLUME_LEVEL 80

#define AUDIO_IN_INSTANCE_SAI			   0U
#define AUDIO_IN_INSTANCE_SAI_PDM		   1U

extern uint16_t AudioBuffer[];
extern volatile uint16_t micTest;
/* Function prototypes */
extern void Error_Handler();
void AudioRecording_Init(void);
void RecordAudio(void);

void BSP_AUDIO_IN_TransferComplete_CallBack(uint32_t Instance);
void BSP_AUDIO_IN_HalfTransfer_CallBack(uint32_t Instance);

#endif // RECORD_H
