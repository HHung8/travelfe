import { formatDistance } from '@/src/utils/distance';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";

type Props = {
    item: {
        id: string;
        title: string;
        subtitle: number;
        distance: number;
    }
}

const NearbyCard = ({item}: Props) => {
    return (
        <View className="w-44 bg-[#2A2A2A] rounded-3xl p-5 mr-4">
            <View className="w-14 h-14 rounded-full bg-violet-600 items-center justify-center">
                <Ionicons name="location" size={24} color="white"/>
            </View>
            <AppText className="text-white font-bold text-lg mt-5" numberOfLines={1}>{item.title}</AppText>
            <View className="flex-row items-center mt-2">
                <Ionicons name="navigate-outline" size={13} color="#a3a3a3" />
                <AppText className="text-neutral-400 ml-1">{formatDistance(item.distance)}</AppText>
            </View>
            <AppText className="text-neutral-400 mt-1">
                Price: {item.subtitle}$
            </AppText>
        </View>
    );
}

export default NearbyCard