/**
 ******************************************************************************
 * @file           : record.c
 * @brief          : Recording audio with BSP
 * @author         : Irinej Slapal
 * @date           : 29-Dec-2023
 *
 * @note           : This file contains functions for audio data acquisition
 * 					 using the BSP driver
 * 					 "https://github.com/STMicroelectronics/stm32h750b-dk-bsp.git"
 *
 * @revision       : 1.0
 * @last_modified  : 29-Dec-2023
 ******************************************************************************
 */

//#include "record.h"

//uint16_t AudioBuffer[AUDIO_IN_PDM_BUFFER_SIZE];
//volatile uint16_t micTest;
//
//
//void AudioRecording_Init(void) {
//	BSP_AUDIO_Init_t AudioInit;
//
//	AudioInit.Device = AUDIO_IN_DEVICE_DIGITAL_MIC1;
//	AudioInit.SampleRate = AUDIO_FREQUENCY;
//	AudioInit.BitsPerSample = AUDIO_RESOLUTION_16B;
//	AudioInit.ChannelsNbr = 1;
//	AudioInit.Volume = AUDIO_VOLUME_LEVEL;
//
//	if (BSP_AUDIO_IN_Init(AUDIO_IN_INSTANCE_SAI_PDM, &AudioInit) != BSP_ERROR_NONE) {
//		Error_Handler();
//	}
//}
//
//void RecordAudio(void) {
//	if (BSP_AUDIO_IN_RecordPDM(AUDIO_IN_INSTANCE_SAI_PDM, (uint8_t *)&AudioBuffer, AUDIO_BUFF_SIZE) != BSP_ERROR_NONE) {
//		Error_Handler();
//	}
//}
//
//void BSP_AUDIO_IN_TransferComplete_CallBack(uint32_t Instance){
//	if (Instance == AUDIO_IN_INSTANCE_SAI_PDM) {
//		micTest = AudioBuffer[34];
//	}
//}
//
//void BSP_AUDIO_IN_HalfTransfer_CallBack(uint32_t Instance){
//	//if (Instance == AUDIO_IN_INSTANCE_SAI) {
//	//	micTest = AudioBuffer[0];
//	//}
//}
//





