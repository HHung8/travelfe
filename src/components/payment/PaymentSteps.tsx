import React from 'react'
import { Text, View } from 'react-native'

const PaymentSteps = () => {
    return (
        <View className="flex-row justify-between items-center px-8 mt-8 mb-6">

            {[1, 2, 3, 4].map((item, index) => (

                <View
                    key={item}
                    className="flex-row items-center"
                >

                    <View
                        className={`w-9 h-9 rounded-full items-center justify-center ${item === 3
                                ? "bg-[#6D5DF6]"
                                : "bg-[#444]"
                            }`}
                    >
                        <Text className="text-white font-bold">
                            {item}
                        </Text>
                    </View>

                    {index !== 3 && (
                        <View className="w-16 h-[2px] bg-[#555]" />
                    )}

                </View>

            ))}

        </View>
    )
}

export default PaymentSteps