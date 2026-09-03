import { useAuth } from '@/src/context/AuthContext';
import { getHotelById } from '@/src/services/hotelService';
import { HotelDetail } from '@/src/types/hotel';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HotelDetailScreen = () => {
  const {hotelId} = useLocalSearchParams<{hotelId: string}>();
  const router = useRouter();
  const {accessToken} = useAuth();
  const [isFavorite, setIsFavorite] = useState(false); 
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  const loadHotel = useCallback(async () => {
    if(!hotelId) return;
    try {
        setError(null);
        setLoading(true);
        const data = await getHotelById(accessToken, hotelId);
        setHotel(data);
    } catch (error:any) {
      setError(error?.message ?? "Không thể tải dữ liệu khách sạn");
    } finally {
        setLoading(false);
    }
  }, [accessToken, hotelId]);

  useEffect(() => {
    loadHotel();
  }, [loadHotel]);

  if (loading) {
    return (
        <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
            <ActivityIndicator color="#fff" size="large" />
        </SafeAreaView>
    )
  }

   if (error || !hotel) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
        <Text className="text-red-400 text-center mb-4">{error ?? "Không tìm thấy khách sạn"}</Text>
        <TouchableOpacity onPress={loadHotel} className="bg-white rounded-2xl px-6 py-3">
          <Text className="text-black font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const amenityList = (hotel.amenities ?? "").split(",").map((a) => a.trim()).filter(Boolean);
  const rooms = hotel.rooms ?? [];
  const fromPrice =
    rooms.length > 0
      ? Math.min(...rooms.map((r) => r.pricePerNight))
      : hotel.minRoomPrice ?? 0;

  return (
   <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View className="relative items-center justify-center" style={{ height: 240, backgroundColor: "#27272a" }}>
          {hotel.thumbnailUrl ? (
            <Image source={{ uri: hotel.thumbnailUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          ) : (
            <Text style={{ fontSize: 72 }}>🏨</Text>
          )}
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
            <Text className="text-yellow-400 text-xs">⭐ {hotel.averageRating ?? hotel.starRating}</Text>
          </View>
          <Text className="text-white text-2xl font-bold mt-3">{hotel.name}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color="#a3a3a3" />
            <Text className="text-neutral-400 text-sm ml-1">{hotel.address}</Text>
          </View>
          {hotel.description && (
            <Text className="text-neutral-300 text-sm leading-6 mt-4">{hotel.description}</Text>
          )}

          {amenityList.length > 0 && (
            <>
              <Text className="text-white font-semibold text-lg mt-6 mb-2">Tiện nghi</Text>
              <View className="flex-row gap-2 flex-wrap">
                {amenityList.map((a) => (
                  <View key={a} className="bg-neutral-800 px-3 py-1.5 rounded-full">
                    <Text className="text-neutral-300 text-xs">{a}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {rooms.length > 0 && (
            <>
              <Text className="text-white font-semibold text-lg mt-6 mb-2">Loại phòng</Text>
              <View className="gap-2">
                {hotel.rooms?.map((room) => (
                  <View key={room.id} className="bg-neutral-900 rounded-2xl p-3 flex-row justify-between items-center">
                    <View className="flex-1 pr-2">
                      <Text className="text-white font-medium">{room.roomType}</Text>
                      <Text className="text-neutral-500 text-xs mt-1">{room.capacity} khách</Text>
                    </View>
                    <Text className="text-violet-400 font-semibold">${room.pricePerNight}/đêm</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900 flex-row items-center justify-between">
        <View>
          <Text className="text-neutral-500 text-xs">Từ</Text>
          <Text className="text-violet-500 text-xl font-bold">${fromPrice}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/hotel-booking-form", params: { hotelId: hotel.id } })}
          className="bg-white rounded-2xl px-8 py-4"
        >
          <Text className="text-black font-semibold text-base">Đặt phòng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default HotelDetailScreen