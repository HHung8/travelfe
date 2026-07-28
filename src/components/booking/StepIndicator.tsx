import React from 'react';
import { Text, View } from 'react-native';

const StepIndicator = ({currentStep, totalSteps = 4 } : {currentStep: number; totalSteps?: number}) => {
    const steps = Array.from({length:totalSteps}, (_,i) => i + 1);
    return (
        <View className="flex-row items-center justify-center py-4">
            {steps.map((step, i) => {
                const isDone = step < currentStep;
                const isActive = step === currentStep;
                return (
                <View key={step} className="flex-row items-center">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isDone ? "bg-green-500" : isActive ? "bg-indigo-500" : "bg-neutral-700"}`}>
                    <Text className="text-white font-semibold">{isDone ? "✓" : step}</Text>
                    </View>
                    {i < steps.length - 1 && <View className={`w-8 h-[2px] mx-1 ${isDone ? "bg-green-500" : "bg-neutral-700"}`} />}
                </View>
                );
            })}
        </View>
    )
}

export default StepIndicator