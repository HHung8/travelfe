import DestinationCard from "@/src/components/home/DestinationCard";
import TourCard from "@/src/components/home/TourCard";
import { useAuth } from "@/src/context/AuthContext";
import { getDestinations } from "@/src/services/destinationService";
import { getTours } from "@/src/services/tourService";
import { Destination } from "@/src/types/destination";
import { Tour } from "@/src/types/tour";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "tours" | "destinations"

export default function SearchScreen() {
    const { accessToken } = useAuth();
    const router = useRouter();

    const [keyword, setKeyword] = useState("");
    const [tab, setTab] = useState<Tab>("tours");
    const [showFilters, setShowFilters] = useState(false);

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minDuration, setMinDuration] = useState("");
    const [maxDuration, setMaxDuration] = useState("");
    const [country, setCountry] = useState("");

    const [tours, setTours] = useState<Tour[]>([]);
    const [loadingTours, setLoadingTours] = useState(true);
    const [errorTours, setErrorTours] = useState<string | null>(null);

    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(true);
    const [errorDestinations, setErrorDestinations] = useState<string | null>(null);

    const fetchTours = async () => {
        setLoadingTours(true);
        setErrorTours(null);
        try {
            const res = await getTours(accessToken, 1, 20, {
                keyword: keyword.trim() || undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                minDuration: minDuration ? Number(minDuration) : undefined,
                maxDuration: maxDuration ? Number(maxDuration) : undefined
            });
            setTours(res.data?.items ?? []);
        } catch (error: any) {
            setErrorTours(error.message || "Không tìm được tour, vui lòng thử lại")
        } finally {
            setLoadingTours(false)
        }
    }

    const fetchDestinations = async () => {
        setLoadingDestinations(true);
        setErrorDestinations(null);
        try {
            const res = await getDestinations(accessToken, 1, 20, {
                keyword: keyword.trim() || undefined,
                country: country.trim() || undefined,
            });
            setDestinations(res.data?.items ?? []);
        } catch (error: any) {
            setErrorDestinations(error.message || "Không tìm được điểm đến vui lòng thử lại.");
        } finally {
            setLoadingDestinations(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(fetchTours, 400);
        return () => clearTimeout(timer);
    }, [keyword]);

    useEffect(() => {
        const timer = setTimeout(fetchDestinations, 400);
        return () => clearTimeout(timer);
    }, [keyword]);

    const applyFilters = () => {
        setShowFilters(false);
        Keyboard.dismiss();
        if (tab === "tours") {
            fetchTours();
        } else {
            fetchDestinations();
        }
    }

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setMinDuration("");
        setMaxDuration("");
        setCountry("");
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Thanh search + nút back */}
            <View className="flex-row items-center px-4 pt-2 pb-3">
                <TouchableOpacity onPress={() => router.back()} className="mr-2 p-2">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View className="flex-1 flex-row items-center bg-[#2B2B2B] rounded-2xl h-12 px-3">
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                    <TextInput
                        autoFocus
                        value={keyword}
                        onChangeText={setKeyword}
                        placeholder="Tìm điểm đến, tour..."
                        placeholderTextColor="#888"
                        className="flex-1 ml-2 text-white"
                        returnKeyType="search"
                    // onSubmitEditing={runSearch}
                    />
                    {keyword.length > 0 && (
                        <TouchableOpacity onPress={() => setKeyword("")}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    onPress={() => setShowFilters((v) => !v)}
                    className="ml-2 p-2"
                >
                    <Ionicons
                        name="options-outline"
                        size={24}
                    // color={hasActiveFilters() ? "#8B5CF6" : "white"}
                    />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className="flex-row px-4 mb-3">
                <TouchableOpacity
                    onPress={() => setTab("tours")}
                    className={`flex-1 py-2 rounded-l-xl items-center ${tab === "tours" ? "bg-violet-600" : "bg-[#2B2B2B]"
                        }`}
                >
                    <Text className="text-white font-semibold">Tour</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab("destinations")}
                    className={`flex-1 py-2 rounded-r-xl items-center ${tab === "destinations" ? "bg-violet-600" : "bg-[#2B2B2B]"
                        }`}
                >
                    <Text className="text-white font-semibold">Điểm đến</Text>
                </TouchableOpacity>
            </View>

            {/* Bộ lọc */}
            {showFilters && (
                <View className="mx-4 mb-3 p-4 bg-[#1E1E1E] rounded-2xl">
                    {tab === "tours" ? (
                        <>
                            <Text className="text-white font-semibold mb-2">Khoảng giá ($)</Text>
                            <View className="flex-row mb-3">
                                <TextInput
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                    placeholder="Từ"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    className="flex-1 bg-[#2B2B2B] text-white rounded-xl px-3 py-2 mr-2"
                                />
                                <TextInput
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                    placeholder="Đến"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    className="flex-1 bg-[#2B2B2B] text-white rounded-xl px-3 py-2"
                                />
                            </View>

                            <Text className="text-white font-semibold mb-2">Số ngày tour</Text>
                            <View className="flex-row">
                                <TextInput
                                    value={minDuration}
                                    onChangeText={setMinDuration}
                                    placeholder="Từ"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    className="flex-1 bg-[#2B2B2B] text-white rounded-xl px-3 py-2 mr-2"
                                />
                                <TextInput
                                    value={maxDuration}
                                    onChangeText={setMaxDuration}
                                    placeholder="Đến"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    className="flex-1 bg-[#2B2B2B] text-white rounded-xl px-3 py-2"
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            <Text className="text-white font-semibold mb-2">Quốc gia</Text>
                            <TextInput
                                value={country}
                                onChangeText={setCountry}
                                placeholder="Ví dụ: Viet Nam, Japan..."
                                placeholderTextColor="#666"
                                className="bg-[#2B2B2B] text-white rounded-xl px-3 py-2"
                            />
                        </>
                    )}

                    <View className="flex-row justify-end mt-4">
                        <TouchableOpacity
                            onPress={clearFilters}
                            className="px-4 py-2 mr-2"
                        >
                            <Text className="text-gray-400 font-semibold">Xóa lọc</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={applyFilters}
                            className="bg-violet-600 px-4 py-2 rounded-xl"
                        >
                            <Text className="text-white font-semibold">Áp dụng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Kết quả */}
            <View className="flex-1 px-4">
                {tab === "tours" ? (
                    loadingTours ? (
                        <ActivityIndicator color="#8B5CF6" style={{ marginTop: 24 }} />
                    ) : errorTours ? (
                        <Text className="text-red-400 mt-4">{errorTours}</Text>
                    ) : tours.length === 0 ? (
                        <Text className="text-gray-500 mt-4 text-center">Không tìm thấy tour phù hợp.</Text>
                    ) : (
                        <FlatList
                            key="tours-list"
                            data={tours}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TourCard
                                    item={item}
                                    onPress={() =>
                                        router.push({ pathname: "/tour-detail", params: { tourId: item.id } })
                                    }
                                />
                            )}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                            contentContainerStyle={{ paddingBottom: 24 }}
                        />
                    )
                ) : loadingDestinations ? (
                    <ActivityIndicator color="#8B5CF6" style={{ marginTop: 24 }} />
                ) : errorDestinations ? (
                    <Text className="text-red-400 mt-4">{errorDestinations}</Text>
                ) : destinations.length === 0 ? (
                    <Text className="text-gray-500 mt-4 text-center">Không tìm thấy điểm đến phù hợp.</Text>
                ) : (
                    <FlatList
                        key="destinations-list"
                        data={destinations}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        renderItem={({ item }) => <DestinationCard item={item} />}
                        columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        contentContainerStyle={{ paddingBottom: 24 }}
                    />
                )}
            </View>
        </SafeAreaView>
    )

}