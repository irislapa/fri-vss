#include "usart3_debug.h"
// Declare the UART Handle as static within this file so it's not accessible outside

UART_HandleTypeDef huart3 = {0};
void USART3_Init(void) {

	RCC_PeriphCLKInitTypeDef PeriphClkInitStruct = {0};

	PeriphClkInitStruct.PeriphClockSelection = RCC_PERIPHCLK_USART3;
    PeriphClkInitStruct.Usart234578ClockSelection = RCC_USART234578CLKSOURCE_D2PCLK1;

    __HAL_RCC_GPIOB_CLK_ENABLE();

	GPIO_InitTypeDef init_structure = {0};
	init_structure.Pin = GPIO_PIN_10 | GPIO_PIN_11;
	init_structure.Mode = GPIO_MODE_AF_PP;
	init_structure.Pull = GPIO_NOPULL;
	init_structure.Speed = GPIO_SPEED_FREQ_LOW;
	init_structure.Alternate = GPIO_AF7_USART3;

	HAL_GPIO_Init(GPIOB, &init_structure);

	__HAL_RCC_USART3_CLK_ENABLE();
    // Initialize your UART here, similar to the given example but specific to your board's UART configuration
    huart3.Instance = USART3;
    huart3.Init.BaudRate = 115200;
    huart3.Init.WordLength = UART_WORDLENGTH_8B;
    huart3.Init.StopBits = UART_STOPBITS_1;
    huart3.Init.Parity = UART_PARITY_NONE;
    huart3.Init.Mode = UART_MODE_TX_RX;
    huart3.Init.HwFlowCtl = UART_HWCONTROL_NONE;
    huart3.Init.OverSampling = UART_OVERSAMPLING_16;
    huart3.Init.Mode = UART_MODE_TX_RX;
    if (HAL_UART_Init(&huart3) != HAL_OK) {
        // Initialization Error
        //Error_Handler(UART_INIT_ERROR);
    }
    setbuf(stdout, NULL);
}

int _write(int file, char *ptr, int len) {
	// Implement your write code here, this is used by puts and printf for example
	if ((HAL_UART_Transmit(&huart3, (uint8_t*) ptr, len, 0xFFFF)) != HAL_OK) {
		//handle_error(UART_TRANSMIT_ERR);
	}
	return len;
}

#ifdef __GNUC__
// With GCC, small printf (option LD Linker->Libraries->Small printf
// set to 'Yes') calls __io_putchar()
int __io_putchar(int ch) {

    return ch;
}
#else
int fputc(int ch, FILE *f) {
    // Same implementation as __io_putchar for non-GCC compilers
    HAL_UART_Transmit(&UartHandle, (uint8_t *)&ch, 1, 0xFFFF);
    return ch;
}
#endif
