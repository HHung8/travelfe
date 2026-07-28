import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
    item:any;
    onPress?: () => void;
}

const BookingCard = ({ item, onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-[#353535] rounded-3xl border border-neutral-600 px-4 py-4 flex-row items-center mb-4"
        >
            <View style={{ backgroundColor: item.color }} className="w-16 h-16 rounded-2xl items-center justify-center">
                <Text className="text-3xl">{item.emoji}</Text>
            </View>

            <View className="flex-1 ml-4">
                <Text className="text-white text-xl font-bold">{item.title}</Text>
                <Text className="text-neutral-400 mt-1">{item.date}</Text>
            </View>

            <View style={{ backgroundColor: item.badgeColor }} className="px-3 py-2 rounded-full">
                <Text style={{ color: item.badgeText }} className="font-semibold">{item.badge}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default BookingCard