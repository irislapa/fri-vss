################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (11.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Drivers/BSP/Components/mt25tl01g/mt25tl01g.c 

OBJS += \
./Drivers/BSP/Components/mt25tl01g/mt25tl01g.o 

C_DEPS += \
./Drivers/BSP/Components/mt25tl01g/mt25tl01g.d 


# Each subdirectory must supply rules for building sources it contributes
Drivers/BSP/Components/mt25tl01g/%.o Drivers/BSP/Components/mt25tl01g/%.su Drivers/BSP/Components/mt25tl01g/%.cyclo: ../Drivers/BSP/Components/mt25tl01g/%.c Drivers/BSP/Components/mt25tl01g/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m7 -std=gnu11 -g3 -DDEBUG -DUSE_HAL_DRIVER -DSTM32H750xx -c -I../Core/Inc -I../Drivers/STM32H7xx_HAL_Driver/Inc -I../Drivers/STM32H7xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32H7xx/Include -I../Drivers/CMSIS/Include -I../Drivers/stm32h750b-dk-bsp-main -I../Drivers/BSP -I../PDM2PCM/App -I../Middlewares/ST/STM32_Audio/Addons/PDM/Inc -I../Utilities/CPU -I../Utilities/Fonts -I../Drivers/BSP/Components/Common -I../Utilities -I../Utilities/lcd -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfpu=fpv5-d16 -mfloat-abi=hard -mthumb -o "$@"

clean: clean-Drivers-2f-BSP-2f-Components-2f-mt25tl01g

clean-Drivers-2f-BSP-2f-Components-2f-mt25tl01g:
	-$(RM) ./Drivers/BSP/Components/mt25tl01g/mt25tl01g.cyclo ./Drivers/BSP/Components/mt25tl01g/mt25tl01g.d ./Drivers/BSP/Components/mt25tl01g/mt25tl01g.o ./Drivers/BSP/Components/mt25tl01g/mt25tl01g.su

.PHONY: clean-Drivers-2f-BSP-2f-Components-2f-mt25tl01g

