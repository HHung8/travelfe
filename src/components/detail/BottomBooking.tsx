import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
    price: number;
}

const BottomBooking = ({ price }: Props) => {
    const router = useRouter();
    return (
        <View className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] px-6 py-5 border-t border-neutral-700">
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-neutral-400">
                        Giá từ
                    </Text>
                    <Text className="text-white text-3xl font-bold">
                        ${price}
                        <Text className="text-base text-neutral-400">
                            {" "}/ người
                        </Text>
                    </Text>
                </View>

                <TouchableOpacity 
                    className="bg-violet-600 px-8 py-4 rounded-2xl"
                    onPress={() => router.push("/booking-form")}
                >
                    <Text className="text-white font-bold text-lg">Đặt ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default BottomBooking