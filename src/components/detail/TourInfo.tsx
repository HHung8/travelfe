import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type TourInfoProps = {
    title: string;
    location: string;
    duration: string;
    maxGuest: number;
    level: string;
    description: string;
}

const TourInfo = ({ title, location, duration, maxGuest, level, description }: TourInfoProps) => {
    return (
        <View className="px-6 mt-6">
            {/* Title */}
            <Text className="text-white text-3xl font-bold">{title}</Text>
            {/* Location */}
            <View className="flex-row items-center mt-3">
                <Ionicons
                    name="location-outline"
                    size={18}
                    color="#9CA3AF"
                />
                <Text className="text-gray-400 ml-2">{location}</Text>
            </View>
            {/* Info */}
            <View className="flex-row justify-between mt-8">
                <View className="items-center flex-1">
                    <View className="w-14 h-14 rounded-full bg-[#2B2B2B] items-center justify-center">
                        <Ionicons
                            name="time-outline"
                            size={24}
                            color="white"
                        />
                    </View>
                    <Text className="text-gray-400 mt-3">{duration}</Text>
                </View>
                <View className="items-center flex-1">
                    <View className="w-14 h-14 rounded-full bg-[#2B2B2B] items-center justify-center">
                        <Ionicons
                            name="people-outline"
                            size={24}
                            color="white"
                        />
                    </View>
                    <Text className="text-gray-400 mt-3">{maxGuest} người</Text>
                </View>
                <View className="items-center flex-1">
                    <View className="w-14 h-14 rounded-full bg-[#2B2B2B] items-center justify-center">
                        <Ionicons
                            name="trending-up-outline"
                            size={24}
                            color="white"
                        />
                    </View>
                    <Text className="text-gray-400 mt-3">
                        {level}
                    </Text>
                </View>
            </View>

            {/* Description */}

            <View className="mt-8">

                <Text className="text-white text-xl font-bold mb-3">
                    Giới thiệu
                </Text>

                <Text className="text-gray-400 leading-7">
                    {description}
                </Text>

            </View>

        </View>
    )
}

export default TourInfo