// import { popularTours } from "@/src/data/home";
import WishlistCard from "@/src/components/profile/WishlistCard";
import { useAuth } from "@/src/context/AuthContext";
import {
    getWishlistAttractions,
    getWishlistDestinations,
    getWishlistHotels,
    getWishlistTours,
} from "@/src/services/wishlishService";
import {
    WishlistAttractionItem,
    WishlistDestinationItem,
    WishlistHotelItem,
    WishlistTourItem,
} from "@/src/types/wishlist";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "tour" | "hotel" | "destination" | "attraction"

export default function FavoritesScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();
    const [tours, setTours] = useState<WishlistTourItem[]>([]);
    const [hotels, setHotels] = useState<WishlistHotelItem[]>([]);
    const [destinations, setDestinations] = useState<WishlistDestinationItem[]>([]);
    const [attractions, setAttractions] = useState<WishlistAttractionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>("tour");
    const requestIdRef = useRef(0);
    const loadWishlist = useCallback(async (isRefresh = false) => {
        const requestId = ++requestIdRef.current;
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const [tourList, hotelList, destinationList, attractionList] = await Promise.all([
                getWishlistTours(accessToken),
                getWishlistHotels(accessToken),
                getWishlistDestinations(accessToken),
                getWishlistAttractions(accessToken),
            ]);
            if (requestId !== requestIdRef.current) return;
            setTours(tourList);
            setHotels(hotelList);
            setDestinations(destinationList);
            setAttractions(attractionList);
        } catch (error: any) {
            if (requestId !== requestIdRef.current) return;
            setTours([]);
            setHotels([]);
            setDestinations([]);
            setAttractions([]);
            setError(error?.message || "Không tải được danh sách yêu thích")
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [accessToken])

    useFocusEffect(
        useCallback(() => {
            loadWishlist();
            return () => {
                requestIdRef.current += 1;
            };
        }, [loadWishlist])
    );

    const totalCount = tours.length + hotels.length + destinations.length + attractions.length;
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        )
    };


    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40, flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadWishlist(true)} tintColor="#8B5CF6" />}
            >
                <View className="mb-6 flex-row items-center">
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Quay lại"
                        onPress={() => router.back()}
                        className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#242424]"
                    >
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white">Danh sách yêu thích</Text>
                        <Text className="mt-1 text-sm text-neutral-400">
                            {totalCount} mục đã lưu
                        </Text>
                    </View>
                </View>

                {totalCount > 0 && (
                    <View className="mb-5 flex-row flex-wrap">
                        {[
                            { key: "tour", label: "Tour", count: tours.length },
                            { key: "hotel", label: "Hotel", count: hotels.length },
                            { key: "destination", label: "Destination", count: destinations.length },
                            { key: "attraction", label: "Attraction", count: attractions.length },
                        ].map((item) => {
                            const selected = filter === item.key;
                            return (
                                <TouchableOpacity
                                    key={item.key}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected }}
                                    onPress={() => setFilter(item.key as FilterType)}
                                    className={`mb-2 mr-2 flex-row items-center rounded-full border px-3 py-2 ${
                                        selected
                                            ? "border-violet-500 bg-violet-500/15"
                                            : "border-neutral-700 bg-[#1D1D1D]"
                                    }`}
                                >
                                    <Text className={selected ? "text-violet-300 font-semibold" : "text-neutral-300"}>
                                        {item.label}
                                    </Text>
                                    <Text className={`ml-1.5 text-xs ${selected ? "text-violet-300" : "text-neutral-500"}`}>
                                        {item.count}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {error ? (
                    <View className="items-center rounded-2xl bg-[#1D1D1D] px-5 py-8">
                        <Ionicons name="cloud-offline-outline" size={36} color="#F87171" />
                        <Text className="mt-3 text-center text-red-400">{error}</Text>
                        <TouchableOpacity
                            onPress={() => loadWishlist()}
                            className="mt-4 rounded-xl bg-violet-600 px-5 py-3"
                        >
                            <Text className="font-semibold text-white">Thử lại</Text>
                        </TouchableOpacity>
                    </View>
                ) : totalCount === 0 ? (
                    <View className="flex-1 items-center justify-center py-16">
                        <View className="h-20 w-20 items-center justify-center rounded-full bg-[#242424]">
                            <Ionicons name="heart-outline" size={40} color="#8B5CF6" />
                        </View>
                        <Text className="mt-5 text-lg font-semibold text-white">
                            Chưa có mục yêu thích
                        </Text>
                        <Text className="mt-2 text-center text-neutral-400">
                            Những tour, khách sạn và địa điểm bạn lưu sẽ xuất hiện ở đây.
                        </Text>
                    </View>
                ) : (
                    <>
                        {filter === "tour" &&
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
                        {filter === "hotel" &&
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
                        {filter === "destination" &&
                            destinations.map((destination) => (
                                <WishlistCard
                                    key={destination.wishlistId ?? `destination-${destination.id}`}
                                    title={destination.name}
                                    subtitle={[destination.city, destination.country].filter(Boolean).join(", ")}
                                    thumbnailUrl={destination.thumbnailUrl ?? null}
                                    price={`${destination.tourCount ?? 0} tour`}
                                    rating={null}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/detail",
                                            params: { destinationId: destination.id },
                                        })
                                    }
                                />
                            ))}
                        {filter === "attraction" &&
                            attractions.map((attraction) => (
                                <WishlistCard
                                    key={attraction.wishlistId ?? `attraction-${attraction.id}`}
                                    title={attraction.name}
                                    subtitle={attraction.destinationName ?? attraction.category ?? ""}
                                    thumbnailUrl={attraction.thumbnailUrl ?? null}
                                    price={attraction.entryFee != null ? `$${attraction.entryFee}` : "—"}
                                    rating={null}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/attraction-detail",
                                            params: { placeId: attraction.id },
                                        })
                                    }
                                />
                            ))}
                        {((filter === "tour" && tours.length === 0) ||
                            (filter === "hotel" && hotels.length === 0) ||
                            (filter === "destination" && destinations.length === 0) ||
                            (filter === "attraction" && attractions.length === 0)) && (
                                <View className="items-center py-12">
                                    <Ionicons name="heart-outline" size={36} color="#737373" />
                                    <Text className="mt-3 text-neutral-400">
                                        Chưa có mục nào trong danh mục này
                                    </Text>
                                </View>
                            )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}