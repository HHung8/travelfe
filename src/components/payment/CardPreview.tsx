import React from 'react'
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";const CardPreview = () => {
    return (
        <View className="mx-6 mt-6 bg-[#3A3A3A] rounded-2xl p-5">
            <AppText className="text-neutral-400">•••• •••• •••• 4242</AppText>
            <View className="flex-row justify-between mt-6">
                <View>
                    <AppText className="text-neutral-400 text-xs">Hết hạn</AppText>
                    <AppText className="text-white">12/27</AppText>
                </View>
                <View>
                    <AppText className="text-neutral-400 text-xs">CVV</AppText>
                    <AppText className="text-white">•••</AppText>
                </View>
            </View>
        </View>

    )
}

export default CardPreview