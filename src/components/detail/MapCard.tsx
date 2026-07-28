import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const MapCard = () => {
    return (
        <View className="mt-8 px-6">
            <Text className="text-white text-xl font-bold mb-4">
                Địa điểm
            </Text>

            <View className="bg-[#252525] rounded-3xl h-48 overflow-hidden justify-center items-center">

                <Ionicons
                    name="map"
                    size={60}
                    color="#8B5CF6"
                />

                <Text className="text-white text-lg font-semibold mt-4">
                    Map Preview
                </Text>

                <Text className="text-neutral-400 mt-2">
                    Quảng Ninh, Việt Nam
                </Text>

                <TouchableOpacity className="bg-violet-600 rounded-full px-6 py-3 mt-6">
                    <Text className="text-white font-semibold">
                        Xem bản đồ
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default MapCard