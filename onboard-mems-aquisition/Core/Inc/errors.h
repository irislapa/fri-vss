
#ifndef ERRORS_H
#define ERRORS_H

#include "stm32h7xx_hal.h"
#include "stdint.h"

#define AUDIO_ERR_NONE 0
#define AUDIO_ERR_UNKNOWN 1
#define UART_TRANSMIT_ERR 2

void handle_error(uint8_t err);

#endif //ERRORS_H

