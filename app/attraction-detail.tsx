import { exploreData } from '@/src/data/explore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AtractionDetailScreen = () => {
    const { placeId } = useLocalSearchParams<{ placeId: string }>();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);

    const place = useMemo(
        () => exploreData.find((i) => i.id === placeId && i.type === "attraction") ?? exploreData.find((i) => i.type === "attraction")!,
        [placeId]
    );

    return (
        <SafeAreaView className='flex-1 bg-[#121212]' edges={["top", "left", "right"]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
                <View
                    className="relative items-center justify-center"
                    style={{ height: 240, backgroundColor: place.color }}
                >
                    <Text style={{ fontSize: 72 }}>{place.emoji}</Text>
                    <View className="absolute top-4 left-4 right-4 flex-row justify-between">
                        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                            <Ionicons name="chevron-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsFavorite((f) => !f)} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#fff"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-6 mt-5">
                    <View className="flex-row items-center bg-neutral-800 self-start px-3 py-1 rounded-full">
                        <Text className="text-yellow-400 text-xs">⭐ {place.rating}</Text>
                    </View>

                    <Text className="text-white text-2xl font-bold mt-3">{place.title}</Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={14} color="#a3a3a3" />
                        <Text className="text-neutral-400 text-sm ml-1">{place.location}</Text>
                    </View>

                    {place.description && (
                        <Text className="text-neutral-300 text-sm leading-6 mt-4">{place.description}</Text>
                    )}

                    <Text className="text-white font-semibold text-lg mt-6 mb-2">Giờ mở cửa</Text>
                    <Text className="text-neutral-300 text-sm">08:00 - 21:00 (Tất cả các ngày)</Text>
                </View>
            </ScrollView>
            <View className='absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900 flex-row items-center justify-between'>
                <View>
                    <Text className="text-violet-500 text-xl font-bold">{place.price}</Text>
                    <Text className="text-neutral-500 text-xs">/vé</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => router.push({pathname:"/ticket-booking-form", params:{placeId: place.id}})}
                    className="bg-white rounded-2xl px-8 py-4"
                >
                    <Text className="text-black font-semibold text-base">Mua vé</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AtractionDetailScreen