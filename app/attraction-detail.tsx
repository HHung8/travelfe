import SafeImage from '@/src/components/detail/SafeImage';
import { useAuth } from '@/src/context/AuthContext';
import { getAttractionById } from '@/src/services/attractionService';
import {
    getAttractionWishlistStatus,
    getCachedWishlistStatus,
    setCachedWishlistStatus,
    toggleWishList,
} from '@/src/services/wishlishService';
import { AttractionDetail } from '@/src/types/attraction';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AtractionDetailScreen = () => {
    const { placeId } = useLocalSearchParams<{ placeId: string }>();
    const router = useRouter();
    const { accessToken } = useAuth();

    const [place, setPlace] = useState<AttractionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(
        () => !!placeId && (getCachedWishlistStatus(accessToken, 'attraction', placeId) ?? false)
    );
    const [loadingFavoriteStatus, setLoadingFavoriteStatus] = useState(
        () => !!placeId && getCachedWishlistStatus(accessToken, 'attraction', placeId) === undefined
    );
    const [favoriteStatusError, setFavoriteStatusError] = useState(false);
    const [togglingFavorite, setTogglingFavorite] = useState(false);

    const load = useCallback(async () => {
        if (!placeId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAttractionById(accessToken, placeId);
            setPlace(data);
        } catch (err: any) {
            setError(err?.message || "Không tải được thông tin địa điểm");
        } finally {
            setLoading(false);
        }
    }, [placeId, accessToken]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        if (!placeId) return;

        const cachedStatus = getCachedWishlistStatus(accessToken, 'attraction', placeId);
        if (cachedStatus !== undefined) {
            setIsFavorite(cachedStatus);
            setLoadingFavoriteStatus(false);
            return;
        }

        let active = true;
        setLoadingFavoriteStatus(true);
        setFavoriteStatusError(false);
        getAttractionWishlistStatus(accessToken, placeId)
            .then((status) => {
                if (active) setIsFavorite(status);
            })
            .catch((error: unknown) => {
                console.error('Failed to load attraction wishlist status', error);
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
    }, [accessToken, placeId]);

    const handleToggleFavorite = async () => {
        if (!place || togglingFavorite || loadingFavoriteStatus) return;
        if (favoriteStatusError) {
            setLoadingFavoriteStatus(true);
            setFavoriteStatusError(false);
            try {
                const status = await getAttractionWishlistStatus(accessToken, place.id);
                setIsFavorite(status);
            } catch (error) {
                console.error('Failed to retry attraction wishlist status', error);
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
            await toggleWishList(accessToken, 'attraction', place.id);
            const nextStatus = !previousStatus;
            setIsFavorite(nextStatus);
            setCachedWishlistStatus(accessToken, 'attraction', place.id, nextStatus);
        } catch (error) {
            console.error('Failed to toggle attraction wishlist', error);
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
        )
    }

    if (error || !place) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
                <Text className="text-red-400 text-center mb-4">{error || "Không tìm thấy địa điểm."}</Text>
                <TouchableOpacity onPress={load} className="bg-white rounded-2xl px-6 py-3">
                    <Text className="text-black font-semibold">Thử lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "left", "right"]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
                <View className="relative" style={{ height: 240 }}>
                    <SafeImage uri={place.thumbnailUrl} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
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
                        <Text className="text-neutral-300 text-xs">{place.category}</Text>
                    </View>
                    <Text className="text-white text-2xl font-bold mt-3">{place.name}</Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={14} color="#a3a3a3" />
                        <Text className="text-neutral-400 text-sm ml-1">{place.destinationName}</Text>
                    </View>

                    <View className="flex-row gap-2 mt-4 flex-wrap">
                        {!!place.openingHours && (
                            <View className="flex-row items-center bg-neutral-800 px-3 py-1.5 rounded-full">
                                <Ionicons name="time-outline" size={14} color="#d4d4d4" />
                                <Text className="text-neutral-300 text-xs ml-1">{place.openingHours}</Text>
                            </View>
                        )}
                    </View>

                    {!!place.description && (
                        <Text className="text-neutral-300 text-sm leading-6 mt-4">{place.description}</Text>
                    )}
                </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900 flex-row items-center justify-between">
                <View>
                    <Text className="text-neutral-500 text-xs">Vé từ</Text>
                    <Text className="text-violet-500 text-xl font-bold">${place.entryFee}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push({pathname:"/attraction-booking-form", params: { placeId: place.id } })}
                    className="bg-white rounded-2xl px-8 py-4"
                >
                    <Text className="text-black font-semibold text-base">Đặt vé</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default AtractionDetailScreen