import React from 'react'
import { Text, View } from 'react-native'

const PaymentTotal = () => {
    return (
        <View className="mx-6 mt-6 bg-[#3A3A3A] rounded-2xl p-5 flex-row justify-between">
            <View>
                <Text className="text-white font-bold">
                    Tổng thanh toán
                </Text>
                <Text className="text-neutral-400">
                    Thanh toán an toàn SSL
                </Text>
            </View>
            <Text className="text-[#6D5DF6] text-3xl font-bold">$344</Text>
        </View>
    )
}

export default PaymentTotal