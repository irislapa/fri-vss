#ifndef __USART3_DEBUG_H
#define __USART3_DEBUG_H

// ERRORS:

#define UART_ERROR_NONE 10U
#define UART_GIPO_INIT_ERROR 11U
#define UART_INIT_ERROR 12U
#define UART_TX_ERROR 13U
#define UART_RX_ERROR 14U

#include "stdio.h"
#include "stm32h7xx_hal.h"
#include "stm32h7xx_hal_uart.h"
#include "stm32h7xx_hal_uart_ex.h"

void USART3_Init(void);
int _write(int file, char *ptr, int len);

#endif // __USART_DEBUG_H


