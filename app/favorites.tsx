// import { popularTours } from "@/src/data/home";
import WishlistCard from "@/src/components/profile/WishlistCard";
import { useAuth } from "@/src/context/AuthContext";
import { getWishlistHotels, getWishlistTours } from "@/src/services/wishlishService";
import { WishlistHotelItem, WishlistTourItem } from "@/src/types/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "tour" | "hotel"

export default function FavoritesScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();
    const [tours, setTours] = useState<WishlistTourItem[]>([]);
    const [hotels, setHotels] = useState<WishlistHotelItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>("all");
    const loadWishlist = useCallback(async (isRefresh = false) => {
        if (refreshing) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const [tourList, hotelList] = await Promise.all([
                getWishlistTours(accessToken),
                getWishlistHotels(accessToken),
            ]);
            setTours(tourList);
            setHotels(hotelList);
        } catch (error: any) {
            setError(error?.message || "Không tải được danh sách yêu thích")
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken])

    useEffect(() => {
        loadWishlist();
    }, [loadWishlist])

    const totalCount = tours.length + hotels.length;
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        )
    };


    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Danh sách yêu thích</Text>
            </View>
            {totalCount > 0 && (
                <View className="flex-row gap-2 px-4 mt-4">
                    {[
                        { key: "all", label: "Tất cả" },
                        { key: "tour", label: `Tour (${tours.length})` },
                        { key: "hotel", label: `Khách sạn (${hotels.length})` },
                    ].map((f) => (
                        <TouchableOpacity
                            key={f.key}
                            onPress={() => setFilter(f.key as FilterType)}
                            className={`px-4 py-2 rounded-full border ${filter === f.key ? "bg-indigo-500/10 border-indigo-500" : "border-neutral-700"}`}
                        >
                            <Text className={filter === f.key ? "text-indigo-400 font-medium" : "text-neutral-400"}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadWishlist(true)} tintColor="#8B5CF6" />}
            >
                {error && <Text className="text-red-400 mb-4">{error}</Text>}
                {
                    totalCount === 0 && !error ? (
                        <View className="items-center justify-center mt-20">
                            <Ionicons name="heart-outline" size={48} color="#525252" />
                            <Text className="text-neutral-500 mt-4">Chưa có mục yêu thích nào</Text>
                        </View>
                    ) : (
                        <>
                            {(filter === "all" || filter === "tour") &&
                                tours.map((tour) => (
                                    <WishlistCard
                                        key={tour.wishlistId}
                                        title={tour.title}
                                        subtitle={tour.destinationName}
                                        thumbnailUrl={tour.thumbnailUrl}
                                        price={
                                            tour.discountPrice != null && tour.discountPrice < tour.price
                                                ? `$${tour.discountPrice}`
                                                : `$${tour.price}`
                                        }
                                        rating={tour.averageRating}
                                        onPress={() => router.push({ pathname: "/tour-detail", params: { tourId: tour.id } })}
                                    />
                                ))}
                            {(filter === "all" || filter === "hotel") &&
                                hotels.map((hotel) => (
                                    <WishlistCard
                                        key={hotel.wishlistId}
                                        title={hotel.name}
                                        subtitle={hotel.destinationName}
                                        thumbnailUrl={hotel.thumbnailUrl}
                                        price={hotel.minRoomPrice != null ? `$${hotel.minRoomPrice}/đêm` : "—"}
                                        rating={hotel.averageRating}
                                        onPress={() => router.push({ pathname: "/hotel-detail", params: { hotelId: hotel.id } })}
                                    />
                                ))}
                        </>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}