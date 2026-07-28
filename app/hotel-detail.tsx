import { exploreData } from '@/src/data/explore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HotelDetailScreen = () => {
  const {hotelId} = useLocalSearchParams<{hotelId: string}>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const hotel = useMemo(
    () => exploreData.find((i) => i.id === hotelId && i.type === "hotel") ?? exploreData.find((i) => i.type === "hotel")!,
    [hotelId]
  );

  return (
    <SafeAreaView className='flex-1 bg-[#121212]' edges={["top", "left", "right"]}>
         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 130}}>
            <View
                className="relative items-center justify-center"
                style={{ height: 240, backgroundColor: hotel.color }}
            >
                <Text style={{fontSize: 72}} >{hotel.emoji}</Text>
                <View className='absolute top-4 left-4 right-4 flex-row justify-between'>
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                    <Ionicons name="chevron-back" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsFavorite((f) => !f)} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
                    <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#fff"} />
                    </TouchableOpacity>
                </View>
            </View>

            <View className='px-6 mt-5'>
                <View className="flex-row items-center bg-neutral-800 self-start px-3 py-1 rounded-full">
                    <Text className="text-yellow-400 text-xs">⭐ {hotel.rating}</Text>
                </View>
                <Text className="text-white text-2xl font-bold mt-3">{hotel.title}</Text>
                <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={14} color="#a3a3a3" />
                    <Text className="text-neutral-400 text-sm ml-1">{hotel.location}</Text>
                </View>
                {hotel.description && (
                    <Text className="text-neutral-300 text-sm leading-6 mt-4">{hotel.description}</Text>
                )}

                <Text className="text-white font-semibold text-lg mt-6 mb-2">Tiện nghi</Text>
                <View className="flex-row gap-2 flex-wrap">
                    {["Wifi miễn phí", "Hồ bơi", "Bữa sáng", "Bãi đỗ xe"].map((a) => (
                    <View key={a} className="bg-neutral-800 px-3 py-1.5 rounded-full">
                        <Text className="text-neutral-300 text-xs">{a}</Text>
                    </View>
                    ))}
                </View>
            </View>
        </ScrollView>
        <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900 flex-row items-center justify-between">
        <View>
          <Text className="text-violet-500 text-xl font-bold">{hotel.price}</Text>
        </View>
        <TouchableOpacity 
            onPress={() => router.push({pathname: "/hotel-booking-form", params: {hotelId: hotel.id}})}
            className="bg-white rounded-2xl px-8 py-4"
        >
          <Text className="text-black font-semibold text-base">Đặt phòng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HotelDetailScreen