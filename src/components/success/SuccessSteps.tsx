import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";const SuccessSteps = () => {
  return (
    <View className='flex-row justify-between items-center px-8 mt-8 mb-6'>
        {[1,2,3].map((item) => (
            <View 
                key={item}
                className='flex-row items-center'
            >
                <View className='w-9 h-9 rounded-full bg-[#444] items-center justify-center'>
                    <AppText className='text-white'>{item}</AppText>
                </View>
                <View className='w-16 h-[2px] bg-[#555]' />
            </View>
        ))}

        <View className='w-9 h-9 rounded-full bg-[#6DA544] items-center justify-center'>
            <Ionicons name='checkmark' size={18} color="white"/>
        </View>
    </View>
  )
}
export default SuccessSteps