import React from 'react'
import { Text, View } from 'react-native'

const CardPreview = () => {
    return (
        <View className="mx-6 mt-6 bg-[#3A3A3A] rounded-2xl p-5">
            <Text className="text-neutral-400">•••• •••• •••• 4242</Text>
            <View className="flex-row justify-between mt-6">
                <View>
                    <Text className="text-neutral-400 text-xs">Hết hạn</Text>
                    <Text className="text-white">12/27</Text>
                </View>
                <View>
                    <Text className="text-neutral-400 text-xs">CVV</Text>
                    <Text className="text-white">•••</Text>
                </View>
            </View>
        </View>

    )
}

export default CardPreview