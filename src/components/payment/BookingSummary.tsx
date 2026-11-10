import React from 'react'
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";const BookingSummary = () => {
    return (
        <View className="mx-6 bg-[#3A3A3A] rounded-2xl p-4">

            <View className="flex-row">

                <View className="w-16 h-16 rounded-xl bg-[#45456D] items-center justify-center">

                    <AppText className="text-3xl">
                        🚣
                    </AppText>

                </View>

                <View className="ml-4 flex-1">

                    <AppText className="text-white font-bold">

                        Vịnh Hạ Long 3N2Đ

                    </AppText>

                    <AppText className="text-neutral-400 mt-1">

                        20 - 23 tháng 7 • 2 khách

                    </AppText>

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

            <AppText className={`${large ? "text-white font-bold text-xl" : "text-neutral-400"}`}>
                {left}
            </AppText>

            <AppText className={`${large ? "text-[#6D5DF6] font-bold text-xl" : "text-white"}`}>
                {right}
            </AppText>

        </View>
    )
}

export default BookingSummary
