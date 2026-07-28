import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
    item: {
        id: string;
        title: string;
        subtitle: string;
    }
}

const NearbyCard = ({item}: Props) => {
    return (
        <View className="w-44 bg-[#2A2A2A] rounded-3xl p-5 mr-4">

            <View className="w-14 h-14 rounded-full bg-violet-600 items-center justify-center">
                <Ionicons
                    name="location"
                    size={24}
                    color="white"
                />
            </View>

            <Text className="text-white font-bold text-lg mt-5">
                {item.title}
            </Text>

            <Text className="text-neutral-400 mt-2">
                {item.subtitle}
            </Text>

        </View>
    );
}

export default NearbyCard