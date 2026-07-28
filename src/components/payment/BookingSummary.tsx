import React from 'react'
import { Text, View } from 'react-native'

const BookingSummary = () => {
    return (
        <View className="mx-6 bg-[#3A3A3A] rounded-2xl p-4">

            <View className="flex-row">

                <View className="w-16 h-16 rounded-xl bg-[#45456D] items-center justify-center">

                    <Text className="text-3xl">
                        🚣
                    </Text>

                </View>

                <View className="ml-4 flex-1">

                    <Text className="text-white font-bold">

                        Vịnh Hạ Long 3N2Đ

                    </Text>

                    <Text className="text-neutral-400 mt-1">

                        20 - 23 tháng 7 • 2 khách

                    </Text>

                </View>

            </View>

            <View className="border-b border-[#555] my-4" />

            <Row left="$149 × 2" right="$298" />
            <Row left="Phí + thuế" right="$46" />

            <View className="border-b border-[#555] my-3" />

            <Row
                left="Tổng"
                right="$344"
                large
            />

        </View>

    )

}

function Row({ left, right, large }: any) {

    return (

        <View className="flex-row justify-between">

            <Text className={`${large ? "text-white font-bold text-xl" : "text-neutral-400"}`}>
                {left}
            </Text>

            <Text className={`${large ? "text-[#6D5DF6] font-bold text-xl" : "text-white"}`}>
                {right}
            </Text>

        </View>
    )
}

export default BookingSummary
