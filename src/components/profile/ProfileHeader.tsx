import React from 'react'
import { Text, View } from 'react-native'

const ProfileHeader = () => {
    return (
        <View className="bg-[#353554] rounded-b-[35px] items-center pt-10 pb-10">

            <View className="w-24 h-24 rounded-full bg-violet-500 items-center justify-center">
                <Text className="text-white text-4xl font-bold">
                    HN
                </Text>
            </View>

            <Text className="text-white text-3xl font-bold mt-5">
                Hung Nguyen
            </Text>

            <Text className="text-neutral-300 text-base mt-2">
                hung@email.com
            </Text>

            <View className="flex-row justify-around w-full mt-8">
                <View className="items-center">
                    <Text className="text-white text-3xl font-bold">
                        12
                    </Text>
                    <Text className="text-neutral-300">
                        Chuyến đi
                    </Text>
                </View>

                <View className="items-center">
                    <Text className="text-white text-3xl font-bold">
                        8
                    </Text>
                    <Text className="text-neutral-300">
                        Đánh giá
                    </Text>
                </View>

                <View className="items-center">
                    <Text className="text-white text-3xl font-bold">
                        24
                    </Text>
                    <Text className="text-neutral-300">
                        Wishlist
                    </Text>
                </View>

            </View>

        </View>
    )
}

export default ProfileHeader