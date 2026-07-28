import { popularTours } from '@/src/data/home';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const TourDetailScreen = () => {
    const {tourId} = useLocalSearchParams<{tourId:string}>();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);
    const tour = useMemo(
        () => popularTours.find((t) => t.id === tourId) ?? popularTours[0],
        [tourId]
    );

    const handleBookNow = () => {
    router.push({ pathname: "/booking-form", params: { tourId: tour.id } });
  };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "left", "right"]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
                {/* Hero */}
                <View
                    className="relative items-center justify-center"
                    style={{ height: 240, backgroundColor: tour.color ?? "#20254F" }}
                >
                    <Text style={{ fontSize: 72 }}>{tour.emoji}</Text>

                    <View className="absolute top-4 left-4 right-4 flex-row justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
                        >
                            <Ionicons name="chevron-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsFavorite((f) => !f)}
                            className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
                        >
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={20}
                                color={isFavorite ? "#ef4444" : "#fff"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="absolute bottom-3 left-4 flex-row items-center bg-black/50 px-3 py-1 rounded-full">
                        <Text className="text-yellow-400 text-xs">⭐ {tour.rating}</Text>
                        {tour.reviewCount != null && (
                            <Text className="text-white text-xs ml-1">· {tour.reviewCount} đánh giá</Text>
                        )}
                    </View>
                </View>

                {/* Thông tin */}
                <View className="px-6 mt-5">
                    <Text className="text-white text-2xl font-bold">{tour.title}</Text>

                    {tour.location && (
                        <View className="flex-row items-center mt-1">
                            <Ionicons name="location-outline" size={14} color="#a3a3a3" />
                            <Text className="text-neutral-400 text-sm ml-1">{tour.location}</Text>
                        </View>
                    )}

                    <View className="flex-row gap-2 mt-4 flex-wrap">
                        <View className="flex-row items-center bg-neutral-800 px-3 py-1.5 rounded-full">
                            <Ionicons name="time-outline" size={14} color="#d4d4d4" />
                            <Text className="text-neutral-300 text-xs ml-1">{tour.duration}</Text>
                        </View>
                        {tour.maxGuests != null && (
                            <View className="flex-row items-center bg-neutral-800 px-3 py-1.5 rounded-full">
                                <Ionicons name="people-outline" size={14} color="#d4d4d4" />
                                <Text className="text-neutral-300 text-xs ml-1">Tối đa {tour.maxGuests}</Text>
                            </View>
                        )}
                        {tour.difficulty && (
                            <View className="flex-row items-center bg-neutral-800 px-3 py-1.5 rounded-full">
                                <Ionicons name="speedometer-outline" size={14} color="#d4d4d4" />
                                <Text className="text-neutral-300 text-xs ml-1">{tour.difficulty}</Text>
                            </View>
                        )}
                    </View>

                    {tour.description && (
                        <Text className="text-neutral-300 text-sm leading-6 mt-4">{tour.description}</Text>
                    )}

                    {/* Vị trí (placeholder bản đồ) */}
                    <Text className="text-white font-semibold text-lg mt-6 mb-2">Vị trí</Text>
                    <View className="h-32 rounded-2xl bg-neutral-800 items-center justify-center">
                        <View className="flex-row items-center bg-black/40 px-3 py-1.5 rounded-full">
                            <Ionicons name="map-outline" size={14} color="#fff" />
                            <Text className="text-white text-xs ml-1">Xem bản đồ đầy đủ</Text>
                        </View>
                    </View>

                    {/* Địa điểm gần đó */}
                    {tour.nearbyAttractions && tour.nearbyAttractions.length > 0 && (
                        <>
                            <Text className="text-white text-xl font-bold mt-8 mb-4">Địa điểm gần đó</Text>
                            <View className="flex-row gap-3">
                                {tour.nearbyAttractions.map((a, idx) => (
                                    <View key={idx} className="flex-1 bg-[#303030] rounded-xl p-3">
                                        <Text className="text-white text-sm font-medium" numberOfLines={1}>
                                            {a.name}
                                        </Text>
                                        <Text className="text-neutral-500 text-xs mt-1">{a.distance}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Bottom booking */}
            <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900 flex-row items-center justify-between">
                <View>
                    <Text className="text-violet-500 text-xl font-bold">${tour.price}</Text>
                    <Text className="text-neutral-500 text-xs">/người · đã gồm thuế</Text>
                </View>
                <TouchableOpacity onPress={handleBookNow} className="bg-white rounded-2xl px-8 py-4">
                    <Text className="text-black font-semibold text-base">Đặt ngay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default TourDetailScreen