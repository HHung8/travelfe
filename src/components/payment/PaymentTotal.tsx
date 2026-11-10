import React from 'react'
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";const PaymentTotal = () => {
    return (
        <View className="mx-6 mt-6 bg-[#3A3A3A] rounded-2xl p-5 flex-row justify-between">
            <View>
                <AppText className="text-white font-bold">
                    Tổng thanh toán
                </AppText>
                <AppText className="text-neutral-400">
                    Thanh toán an toàn SSL
                </AppText>
            </View>
            <AppText className="text-[#6D5DF6] text-3xl font-bold">$344</AppText>
        </View>
    )
}

export default PaymentTotal