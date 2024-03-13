################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (11.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery.c \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_audio.c \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_bus.c \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_lcd.c \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_mmc.c \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_qspi.c \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_sdram.c \
../Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_ts.c 

OBJS += \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery.o \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_audio.o \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_bus.o \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_lcd.o \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_mmc.o \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_qspi.o \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_sdram.o \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_ts.o 

C_DEPS += \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery.d \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_audio.d \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_bus.d \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_lcd.d \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_mmc.d \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_qspi.d \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_sdram.d \
./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_ts.d 


# Each subdirectory must supply rules for building sources it contributes
Drivers/stm32h750b-dk-bsp-main/%.o Drivers/stm32h750b-dk-bsp-main/%.su Drivers/stm32h750b-dk-bsp-main/%.cyclo: ../Drivers/stm32h750b-dk-bsp-main/%.c Drivers/stm32h750b-dk-bsp-main/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m7 -std=gnu11 -g3 -DDEBUG -DUSE_HAL_DRIVER -DSTM32H750xx -c -I../Core/Inc -I../Drivers/STM32H7xx_HAL_Driver/Inc -I../Drivers/STM32H7xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32H7xx/Include -I../Drivers/CMSIS/Include -I../Drivers/stm32h750b-dk-bsp-main -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-Drivers-2f-stm32h750b-2d-dk-2d-bsp-2d-main

clean-Drivers-2f-stm32h750b-2d-dk-2d-bsp-2d-main:
	-$(RM) ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery.su ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_audio.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_audio.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_audio.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_audio.su ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_bus.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_bus.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_bus.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_bus.su ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_lcd.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_lcd.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_lcd.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_lcd.su ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_mmc.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_mmc.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_mmc.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_mmc.su ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_qspi.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_qspi.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_qspi.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_qspi.su ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_sdram.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_sdram.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_sdram.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_sdram.su ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_ts.cyclo ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_ts.d ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_ts.o ./Drivers/stm32h750b-dk-bsp-main/stm32h750b_discovery_ts.su

.PHONY: clean-Drivers-2f-stm32h750b-2d-dk-2d-bsp-2d-main

