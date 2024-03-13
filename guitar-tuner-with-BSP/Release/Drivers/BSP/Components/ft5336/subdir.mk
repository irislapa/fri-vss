################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (11.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Drivers/BSP/Components/ft5336/ft5336.c \
../Drivers/BSP/Components/ft5336/ft5336_reg.c 

OBJS += \
./Drivers/BSP/Components/ft5336/ft5336.o \
./Drivers/BSP/Components/ft5336/ft5336_reg.o 

C_DEPS += \
./Drivers/BSP/Components/ft5336/ft5336.d \
./Drivers/BSP/Components/ft5336/ft5336_reg.d 


# Each subdirectory must supply rules for building sources it contributes
Drivers/BSP/Components/ft5336/%.o Drivers/BSP/Components/ft5336/%.su Drivers/BSP/Components/ft5336/%.cyclo: ../Drivers/BSP/Components/ft5336/%.c Drivers/BSP/Components/ft5336/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m7 -std=gnu11 -DUSE_HAL_DRIVER -DSTM32H750xx -c -I../Core/Inc -I../Drivers/STM32H7xx_HAL_Driver/Inc -I../Drivers/STM32H7xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32H7xx/Include -I../Drivers/CMSIS/Include -I../PDM2PCM/App -I../Middlewares/ST/STM32_Audio/Addons/PDM/Inc -Os -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-Drivers-2f-BSP-2f-Components-2f-ft5336

clean-Drivers-2f-BSP-2f-Components-2f-ft5336:
	-$(RM) ./Drivers/BSP/Components/ft5336/ft5336.cyclo ./Drivers/BSP/Components/ft5336/ft5336.d ./Drivers/BSP/Components/ft5336/ft5336.o ./Drivers/BSP/Components/ft5336/ft5336.su ./Drivers/BSP/Components/ft5336/ft5336_reg.cyclo ./Drivers/BSP/Components/ft5336/ft5336_reg.d ./Drivers/BSP/Components/ft5336/ft5336_reg.o ./Drivers/BSP/Components/ft5336/ft5336_reg.su

.PHONY: clean-Drivers-2f-BSP-2f-Components-2f-ft5336

