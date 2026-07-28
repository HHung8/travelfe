import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const SuccessActions = () => {
    const router = useRouter();

    return (
        <View className='mt-8'>
            <TouchableOpacity
                className='border border-[#666] rounded-2xl mb-4'
                onPress={() => router.replace("/booking")}
            >
                <Text className='text-white text-center text-xl font-bold'>Xem booking của tôi</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className='border border-[#666] rounded-2xl py-5'
                onPress={() => router.replace("/(root)/home")}
            >
                <Text className='text-white text-center text-xl font-bold'>
                    Về trang chủ
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default SuccessActions