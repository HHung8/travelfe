import RoomCard from '@/src/components/detail/RoomCard';
import { useAuth } from '@/src/context/AuthContext';
import { getHotelById } from '@/src/services/hotelService';
import {
  getCachedWishlistStatus, getHotelWishlistStatus, setCachedWishlistStatus, toggleWishList, } from '@/src/services/wishlishService';
import { HotelDetail } from '@/src/types/hotel';
import { resolveImageUrl } from '@/src/utils/image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";
import { SafeAreaView } from 'react-native-safe-area-context';



const HotelDetailScreen = () => {
  const { hotelId } = useLocalSearchParams<{ hotelId: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [isFavorite, setIsFavorite] = useState(
    () => !!hotelId && (getCachedWishlistStatus(accessToken, 'hotel', hotelId) ?? false)
  );
  const [loadingFavoriteStatus, setLoadingFavoriteStatus] = useState(
    () => !!hotelId && getCachedWishlistStatus(accessToken, 'hotel', hotelId) === undefined
  );
  const [favoriteStatusError, setFavoriteStatusError] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const imageUri = resolveImageUrl(hotel?.thumbnailUrl);
  console.log("thumbnailUrl:", hotel?.thumbnailUrl, "=> imageUri:", imageUri);

  const loadHotel = useCallback(async () => {
    if (!hotelId) return;
    try {
      setError(null);
      setLoading(true);
      const data = await getHotelById(accessToken, hotelId);
      setHotel(data);
    } catch (error: any) {
      setError(error?.message ?? "Không thể tải dữ liệu khách sạn");
    } finally {
      setLoading(false);
    }
  }, [accessToken, hotelId]);

  useEffect(() => {
    loadHotel();
  }, [loadHotel]);

  useEffect(() => {
    if (!hotelId) return;

    const cachedStatus = getCachedWishlistStatus(accessToken, 'hotel', hotelId);
    if (cachedStatus !== undefined) {
      setIsFavorite(cachedStatus);
      setLoadingFavoriteStatus(false);
      return;
    }

    let active = true;
    setLoadingFavoriteStatus(true);
    setFavoriteStatusError(false);
    getHotelWishlistStatus(accessToken, hotelId)
      .then((status) => {
        if (active) setIsFavorite(status);
      })
      .catch((error: unknown) => {
        console.error('Failed to load hotel wishlist status', error);
        if (active) {
          setFavoriteStatusError(true);
          Alert.alert('Không thể tải wishlist', 'Vui lòng thử lại sau.');
        }
      })
      .finally(() => {
        if (active) setLoadingFavoriteStatus(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, hotelId]);

  const handleToggleFavorite = async () => {
    if (!hotel || togglingFavorite || loadingFavoriteStatus) return;
    if (favoriteStatusError) {
      setLoadingFavoriteStatus(true);
      setFavoriteStatusError(false);
      try {
        const status = await getHotelWishlistStatus(accessToken, hotel.id);
        setIsFavorite(status);
      } catch (error) {
        console.error('Failed to retry hotel wishlist status', error);
        setFavoriteStatusError(true);
        Alert.alert('Không thể tải wishlist', 'Vui lòng thử lại sau.');
      } finally {
        setLoadingFavoriteStatus(false);
      }
      return;
    }

    const previousStatus = isFavorite;
    setIsFavorite(!previousStatus);
    setTogglingFavorite(true);
    try {
      await toggleWishList(accessToken, 'hotel', hotel.id);
      const nextStatus = !previousStatus;
      setIsFavorite(nextStatus);
      setCachedWishlistStatus(accessToken, 'hotel', hotel.id, nextStatus);
    } catch (error) {
      console.error('Failed to toggle hotel wishlist', error);
      setIsFavorite(previousStatus);
      Alert.alert('Không thể cập nhật wishlist', 'Vui lòng thử lại.');
    } finally {
      setTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    );
  }

  if (error || !hotel) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
        <AppText className="text-red-400 text-center mb-4">{error ?? "Không tìm thấy khách sạn"}</AppText>
        <TouchableOpacity onPress={loadHotel} className="bg-white rounded-2xl px-6 py-3">
          <AppText className="text-black font-semibold">Thử lại</AppText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const amenityList = (hotel.amenities ?? "").split(",").map((a) => a.trim()).filter(Boolean);
  const rooms = hotel.rooms ?? [];
  const fromPrice = rooms.length > 0 ? Math.min(...rooms.map((r) => r.pricePerNight)) : hotel.minRoomPrice ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View className="relative items-center justify-center" style={{ height: 240, backgroundColor: "#27272a" }}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              onError={(e) => console.log("IMG ERR", imageUri, e.nativeEvent)}
            />
          ) : (
            <AppText style={{ fontSize: 72 }}>🏨</AppText>
          )}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center">
              <Ionicons name="chevron-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              disabled={togglingFavorite || loadingFavoriteStatus}
              className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ef4444" : "#fff"} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 mt-5">
          <View className="flex-row items-center bg-neutral-800 self-start px-3 py-1 rounded-full">
            <AppText className="text-yellow-400 text-xs">⭐ {hotel.averageRating ?? hotel.starRating}</AppText>
          </View>
          <AppText className="text-white text-2xl font-bold mt-3">{hotel.name}</AppText>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color="#a3a3a3" />
            <AppText className="text-neutral-400 text-sm ml-1">{hotel.address}</AppText>
          </View>
          {hotel.description && (
            <AppText className="text-neutral-300 text-sm leading-6 mt-4">{hotel.description}</AppText>
          )}

          {amenityList.length > 0 && (
            <>
              <AppText className="text-white font-semibold text-lg mt-6 mb-2">Tiện nghi</AppText>
              <View className="flex-row gap-2 flex-wrap">
                {amenityList.map((a) => (
                  <View key={a} className="bg-neutral-800 px-3 py-1.5 rounded-full">
                    <AppText className="text-neutral-300 text-xs">{a}</AppText>
                  </View>
                ))}
              </View>
            </>
          )}

          {rooms.length > 0 && (
            <>
              <AppText className="text-white font-semibold text-lg mt-6 mb-2">Loại phòng</AppText>
              <View>
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} token={accessToken} />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900 flex-row items-center justify-between">
        <View>
          <AppText className="text-neutral-500 text-xs">Từ</AppText>
          <AppText className="text-violet-500 text-xl font-bold">${fromPrice}</AppText>
        </View>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/hotel-booking-form", params: { hotelId: hotel.id } })}
          className="bg-white rounded-2xl px-8 py-4"
        >
          <AppText className="text-black font-semibold text-base">Đặt phòng</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HotelDetailScreen;