import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SafeImage from '../detail/SafeImage';

type Props = {
   item: {
      id: string;
      title: string;
      date: string;
      thumbnailUrl: string | null;
      badge: string;
      badgeColor: string;
      badgeText: string;
      type: "tour" | "hotel";
   };
   onPress?: () => void;
};

const BookingCard = ({ item, onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-[#353535] rounded-3xl border border-neutral-600 px-4 py-4 flex-row items-center mb-4"
        >
           <View className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-700 items-center justify-center">
            {item.thumbnailUrl ? (
            <SafeImage uri={item.thumbnailUrl} className="w-full h-full" resizeMode="cover" />
            ) : (
            <Ionicons name={item.type === "tour" ? "airplane-outline" : "bed-outline"} size={28} color="#a3a3a3" />
            )}
        </View>

        <View className="flex-1 ml-4">
            <Text className="text-white text-xl font-bold" numberOfLines={1}>{item.title}</Text>
            <Text className="text-neutral-400 mt-1">{item.date}</Text>
        </View>

        <View style={{ backgroundColor: item.badgeColor }} className="px-3 py-2 rounded-full">
            <Text style={{ color: item.badgeText }} className="font-semibold">{item.badge}</Text>
        </View>
        </TouchableOpacity>
    )
}
export default BookingCard;
