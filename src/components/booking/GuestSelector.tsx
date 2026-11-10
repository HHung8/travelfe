import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";const GuestSelector = () => {
    return (
        <View className="mx-6 mt-6 bg-[#3A3A3A] rounded-2xl p-5">
            <View className="flex-row justify-between items-center">
                <View>
                    <AppText className="text-white font-bold text-xl">Số khách</AppText>
                    <AppText className="text-neutral-400">Tối đa 20 người</AppText>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity>
                        <Ionicons
                            name="remove-circle-outline"
                            size={30}
                            color="white"
                        />
                    </TouchableOpacity>
                    <AppText className="text-white text-2xl mx-5">2</AppText>
                    <TouchableOpacity>
                        <Ionicons
                            name="add-circle-outline"
                            size={30}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    )
}

export default GuestSelector