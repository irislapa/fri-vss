
/* Functions for initializing all the audio pehripherals and converting PDM to PCM */

#include "audio.h"



SAI_HandleTypeDef hsaia4; // SAI4 BLOCK A handle
DMA_HandleTypeDef hdma_saia4; // DMA handle
ALIGN_32BYTES (uint16_t pdm_buffer[AUDIO_IN_PDM_BUFFER_SIZE]) __attribute__((section(".RAM_D3")));
volatile uint16_t pcm_buffer[BUFFER_SIZE];
static PDM_Filter_Handler_t PDM1_filter_handler;
static PDM_Filter_Config_t PDM_filter_config;


uint32_t audio_Init(){
	MX_SAI4_ClockConfig(&hsaia4, 16000);
	MX_SAI4_Init(&hsaia4);
    PDM2PCM_Init();
}

void audio_DeInit() {

}



// clock configuration for SAI4A
HAL_StatusTypeDef MX_SAI4_ClockConfig(SAI_HandleTypeDef hsai, uint32_t SampleRate)
{
  /* Prevent unused argument(s) compilation warning */
  UNUSED(hsai);

  HAL_StatusTypeDef ret = HAL_OK;
  RCC_PeriphCLKInitTypeDef rcc_ex_clk_init_struct;
  HAL_RCCEx_GetPeriphCLKConfig(&rcc_ex_clk_init_struct);

  /* Set the PLL configuration according to the audio frequency */

  rcc_ex_clk_init_struct.PLL2.PLL2P = 7;
  rcc_ex_clk_init_struct.PLL2.PLL2N = 344;

    /* SAI clock config */
  rcc_ex_clk_init_struct.PeriphClockSelection = RCC_PERIPHCLK_SAI4A;
  rcc_ex_clk_init_struct.Sai4AClockSelection = RCC_SAI4ACLKSOURCE_PLL2;
  rcc_ex_clk_init_struct.PLL2.PLL2Q = 1;
  rcc_ex_clk_init_struct.PLL2.PLL2R = 1;
  rcc_ex_clk_init_struct.PLL2.PLL2M = 25;
  if(HAL_RCCEx_PeriphCLKConfig(&rcc_ex_clk_init_struct) != HAL_OK)
  {
    ret = HAL_ERROR;
  }
  return ret;
}



void MX_SAI4_Init(SAI_HandleTypeDef *hsai)
{

  __HAL_SAI_DISABLE(hsai);

  hsai->Instance = SAI4_Block_A;
  hsai->Init.Protocol = SAI_FREE_PROTOCOL;
  hsai->Init.AudioMode = SAI_MODEMASTER_RX;
  hsai->Init.DataSize = SAI_DATASIZE_16;
  hsai->Init.FirstBit = SAI_FIRSTBIT_LSB;
  hsai->Init.ClockStrobing = SAI_CLOCKSTROBING_FALLINGEDGE;
  hsai->Init.Synchro = SAI_ASYNCHRONOUS;
  hsai->Init.OutputDrive = SAI_OUTPUTDRIVE_DISABLE;
  hsai->Init.SynchroExt = SAI_SYNCEXT_DISABLE;
  hsai->Init.NoDivider = SAI_MASTERDIVIDER_DISABLE;
  hsai->Init.FIFOThreshold = SAI_FIFOTHRESHOLD_1QF;
  hsai->Init.AudioFrequency = SAI_AUDIO_FREQUENCY_16K*8;
  hsai->Init.MonoStereoMode = SAI_STEREOMODE;
  hsai->Init.CompandingMode = SAI_NOCOMPANDING;
  hsai->Init.Mckdiv = 0;
  hsai->Init.PdmInit.Activation = ENABLE;
  hsai->Init.PdmInit.MicPairsNbr = 2;
  hsai->Init.PdmInit.ClockEnable = SAI_PDM_CLOCK2_ENABLE;

  // configure frame
  hsai->FrameInit.FrameLength = 32;
  hsai->FrameInit.ActiveFrameLength = 1;
  hsai->FrameInit.FSDefinition = SAI_FS_STARTFRAME;
  hsai->FrameInit.FSPolarity = SAI_FS_ACTIVE_LOW;
  hsai->FrameInit.FSOffset = SAI_FS_FIRSTBIT;

  // configure slot
  hsai->SlotInit.FirstBitOffset = 0;
  hsai->SlotInit.SlotSize = SAI_SLOTSIZE_DATASIZE;
  hsai->SlotInit.SlotNumber = 1;
  hsai->SlotInit.SlotActive = 0x00000002U;
  if (HAL_SAI_Init(hsai) != HAL_OK)
  {
    Error_Handler();
  }
  __HAL_SAI_ENABLE(hsai);

  /* USER CODE BEGIN SAI4_Init 2 */

  /* USER CODE END SAI4_Init 2 */

}

int32 PDM2PCM_Init() {
	__HAL_RCC_CRC_CLK_ENABLE();
	PDM1_filter_handler.bit_order = PDM_FILTER_BIT_ORDER_LSB;
	PDM1_filter_handler.endianness = PDM_FILTER_ENDIANNESS_LE;
	PDM1_filter_handler.high_pass_tap = 2122358088;
	PDM1_filter_handler.out_ptr_channels = 1;
	PDM1_filter_handler.in_ptr_channels = 1;
	PDM1_filter_handler.pInternalMemory = &pdm_filter[0];

    PDM_filter_config.output_samples_number = AUDIO_FREQUENCY/1000;
    PDM_filter_config.mic_gain = 24;
    PDM_filter_config.decimation_factor = (uint16_t) 0x002;

}


static uint32_t SAI4_client =0;

void HAL_SAI_MspInit(SAI_HandleTypeDef *hsai) {

  static DMA_HandleTypeDef hdma;

  GPIO_InitTypeDef GPIO_InitStruct;
  RCC_PeriphCLKInitTypeDef PeriphClkInitStruct = {0};
    /* SAI4 */
  if (hsaia4.Instance == SAI4_Block_A)
  {
    /* SAI4 clock enable */

    /** Initializes the peripherals clock
    */
    PeriphClkInitStruct.PeriphClockSelection = RCC_PERIPHCLK_SAI4A;
    PeriphClkInitStruct.Sai4AClockSelection = RCC_SAI4ACLKSOURCE_PLL;
    if (HAL_RCCEx_PeriphCLKConfig(&PeriphClkInitStruct) != HAL_OK)
    {
      Error_Handler();
    }

    /**SAI4_A_Block_A GPIO Configuration
    PE5     ------> SAI4_CK2
    PE4     ------> SAI4_D2
    */
    __HAL_RCC_SAI4_CLK_ENABLE();
    __HAL_RCC_GPIOE_CLK_ENABLE();

    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
    GPIO_InitStruct.Alternate = GPIO_AF10_SAI4;
    HAL_GPIO_Init(GPIOD, &GPIO_InitStruct);

    GPIO_InitStruct.Pin = GPIO_PIN_4;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_MEDIUM;
    GPIO_InitStruct.Alternate = GPIO_AF10_SAI4;
    HAL_GPIO_Init(GPIOE, &GPIO_InitStruct);

    /* Peripheral DMA init*/

    __HAL_RCC_BDMA_CLK_ENABLE();

    hdma.Instance = BDMA_Channel1;
    hdma.Init.Request = BDMA_REQUEST_SAI4_A;
    hdma.Init.Direction = DMA_PERIPH_TO_MEMORY;
    hdma.Init.PeriphInc = DMA_PINC_DISABLE;
    hdma.Init.MemInc = DMA_MINC_ENABLE;
    hdma.Init.PeriphDataAlignment = DMA_PDATAALIGN_HALFWORD;
    hdma.Init.MemDataAlignment = DMA_MDATAALIGN_WORD;
    hdma.Init.Mode = DMA_CIRCULAR;
    hdma.Init.Priority = DMA_PRIORITY_HIGH;
    hdma.Init.FIFOMode = DMA_FIFOMODE_DISABLE;
    hdma.Init.FIFOThreshold = DMA_FIFO_THRESHOLD_FULL;
    hdma.Init.MemBurst = DMA_MBURST_SINGLE;
    hdma.Init.PeriphBurst = DMA_PBURST_SINGLE;

    __HAL_LINKDMA(hsai, hdmarx, hdma);

    HAL_DMA_DeInit(&hdma);

    if (HAL_DMA_Init(&hdma) != HAL_OK)
    {
      Error_Handler();
    }

    HAL_NVIC_SetPriority(BDMA_Channel1_IRQn, 15, 0);
    HAL_NVIC_EnableIRQ(BDMA_Channel1_IRQn);

    /* Several peripheral DMA handle pointers point to the same DMA handle.
     Be aware that there is only one channel to perform all the requested DMAs. */


    }
}

void HAL_SAI_MspDeInit(SAI_HandleTypeDef* saiHandle)
{

/* SAI4 */
    if(hsaia4.Instance==SAI4_Block_A)
    {
    SAI4_client --;
    if (SAI4_client == 0)
      {
      /* Peripheral clock disable */
       __HAL_RCC_SAI4_CLK_DISABLE();
      }


    HAL_GPIO_DeInit(GPIOE, GPIO_PIN_5|GPIO_PIN_4);

    HAL_DMA_DeInit(hsaia4.hdmarx);
    }
}


void HAL_SAI_RxHalfCpltCallback(SAI_HandleTypeDef *hsai)
{
	if (hsai->Instance == SAI4_Block_A) {

		SCB_InvalidateDCache_by_Addr((uint32_t *)&recordPDMBuf[0], AUDIO_IN_PDM_BUFFER_SIZE*2);

		PDM_Filter(&pdm_buffer, &pcm_buffer, &PDM1_filter_handler);

		SCB_CleanDCache_by_Addr((uint32_t*)&RecPlayback[playbackPtr], AUDIO_IN_PDM_BUFFER_SIZE/4);

	}    // Assuming 'pdmBuffer' is where PDM data is stored and 'pcmBuffer' is for PCM data

    // Optionally, play or process PCM data here
}
void HAL_SAI_RxCpltCallback(SAI_HandleTypeDef *hsai) {

	if (hsai->Instance == SAI4_Block_A) {

		SCB_InvalidateDCache_by_Addr((uint32_t *)&recordPDMBuf[0], AUDIO_IN_PDM_BUFFER_SIZE*2);

		PDM_Filter(&pdm_buffer, &pcm_buffer, &PDM1_filter_handler);

		SCB_CleanDCache_by_Addr((uint32_t*)&RecPlayback[playbackPtr], AUDIO_IN_PDM_BUFFER_SIZE/4);

	}
}


