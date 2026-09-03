import CategoryChip from '@/src/components/explore/CategoryChip'
import { useAuth } from '@/src/context/AuthContext'
import { getHotelBookings, getTourBookings } from '@/src/services/bookingService'
import { UnifiedBookingItem } from '@/src/types/bookingList'
import { getStatusMeta } from '@/src/utils/bookingStatus'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

type BookingTab = "tour" | "hotel" | "attraction";

const TABS: { key: BookingTab; label: string }[] = [
    { key: "tour", label: "Tour" },
    { key: "hotel", label: "Khách sạn" },
    { key: "attraction", label: "Điểm vui chơi" },
];

type CardData = {
    id: string;
    type: BookingTab;
    refId: string;
    title: string;
    date: string;
    thumbnailUrl: string | null;
    totalPrice: number;
    bookingCode: string;
    badgeLabel: string;
    badgeColor: string;
    badgeText: string;
};

type Row =
    | { rowType: "header"; key: string; title: string }
    | { rowType: "item"; key: string; data: CardData };

const typeEmoji: Record<BookingTab, string> = {
    tour: "🧭",
    hotel: "🏨",
    attraction: "🎡",
};

function BookingCard({ item, onPress }: { item: CardData; onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row bg-neutral-900 rounded-2xl p-3 items-center gap-3 mb-3"
        >
            <View className="w-16 h-16 rounded-xl items-center justify-center bg-neutral-800 overflow-hidden">
                {item.thumbnailUrl ? (
                    <Image source={{ uri: item.thumbnailUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                ) : (
                    <Text style={{ fontSize: 28 }}>{typeEmoji[item.type]}</Text>
                )}
            </View>

            <View className="flex-1">
                <Text className="text-white font-semibold" numberOfLines={1}>{item.title}</Text>
                <Text className="text-neutral-400 text-xs mt-1">{item.date}</Text>
                <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-neutral-500 text-xs">{item.bookingCode}</Text>
                    <Text className="text-violet-400 font-semibold text-sm">${item.totalPrice}</Text>
                </View>
            </View>

            <View
                className="px-2 py-1 rounded-full self-start"
                style={{ backgroundColor: item.badgeColor }}
            >
                <Text className="text-xs font-medium" style={{ color: item.badgeText }}>
                    {item.badgeLabel}
                </Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#737373" />
        </TouchableOpacity>
    );
}

const BookingScreen = () => {
    const router = useRouter();
    const { accessToken } = useAuth();

    const [items, setItems] = useState<UnifiedBookingItem[]>([]);
    const [activeTab, setActiveTab] = useState<BookingTab>("tour");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setError(null);
        }

        try {
            const [tourBookings, hotelBookings] = await Promise.all([
                getTourBookings(accessToken),
                getHotelBookings(accessToken),
                // TODO: nối getAttractionBookings(accessToken) khi có API, map tương tự bên dưới
            ]);

            const tourItems: UnifiedBookingItem[] = tourBookings.map((b) => ({
                id: b.id,
                type: "tour",
                refId: b.tourId,
                title: b.tourTitle,
                dateLabel: `Khởi hành: ${fmtDate(b.travelDate)}`,
                sortDate: b.travelDate,
                thumbnailUrl: b.thumbnailUrl,
                totalPrice: b.totalPrice,
                status: b.status,
                bookingCode: b.bookingCode,
            }));

            const hotelItems: UnifiedBookingItem[] = hotelBookings.map((b) => ({
                id: b.id,
                type: "hotel",
                refId: b.roomId,
                title: b.hotelName,
                dateLabel: `${fmtDate(b.checkIn)} - ${fmtDate(b.checkOut)}`,
                sortDate: b.checkIn,
                thumbnailUrl: b.thumbnailUrl,
                totalPrice: b.totalPrice,
                status: b.status,
                bookingCode: b.bookingCode,
            }));

            const all = [...tourItems, ...hotelItems].sort(
                (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
            );
            setItems(all);
        } catch (err: any) {
            setError(err?.message || "Không tải được danh sách booking");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handlePressItem = (item: UnifiedBookingItem) => {
        router.push({
            pathname: "/booking-detail",
            params: { type: item.type, bookingId: item.id },
        });
    };

    const filteredItems = useMemo(
        () => items.filter((i) => i.type === activeTab),
        [items, activeTab]
    );

    // Flatten thành danh sách "hàng" thực sự: mỗi header và mỗi card là 1 hàng riêng,
    // để FlatList virtualize và cuộn đúng nghĩa thay vì phình 1 khối duy nhất.
    const rows = useMemo<Row[]>(() => {
        const statusGroups = Array.from(new Set(filteredItems.map((i) => i.status)));
        const result: Row[] = [];
        statusGroups.forEach((status) => {
            const meta = getStatusMeta(status);
            result.push({ rowType: "header", key: `h-${activeTab}-${status}`, title: meta.label });
            filteredItems
                .filter((i) => i.status === status)
                .forEach((i) => {
                    result.push({
                        rowType: "item",
                        key: `${i.type}-${i.id}`,
                        data: {
                            id: i.id,
                            type: i.type as BookingTab,
                            refId: i.refId,
                            title: i.title,
                            date: i.dateLabel,
                            thumbnailUrl: i.thumbnailUrl,
                            totalPrice: i.totalPrice,
                            bookingCode: i.bookingCode,
                            badgeLabel: meta.label,
                            badgeColor: meta.badgeColor,
                            badgeText: meta.badgeText,
                        },
                    });
                });
        });
        return result;
    }, [filteredItems, activeTab]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="px-6">
                <Text className="text-white text-4xl font-bold mt-4 mb-6">Booking của tôi</Text>

                <FlatList
                    horizontal
                    data={TABS}
                    keyExtractor={(t) => t.key}
                    showsHorizontalScrollIndicator={false}
                    className="mb-2"
                    renderItem={({ item }) => (
                        <CategoryChip
                            title={item.label}
                            active={item.key === activeTab}
                            onPress={() => setActiveTab(item.key)}
                        />
                    )}
                />
            </View>

            {error && <Text className="text-red-400 px-6 mb-2">{error}</Text>}

            {filteredItems.length === 0 && !error ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-neutral-500 text-center">Chưa có booking nào ở mục này</Text>
                </View>
            ) : (
                <FlatList
                    className="flex-1 px-6"
                    contentContainerStyle={{ paddingBottom: 24 }}
                    data={rows}
                    keyExtractor={(row) => row.key}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => fetchBookings(true)} tintColor="#8B5CF6" />
                    }
                    renderItem={({ item: row }) =>
                        row.rowType === "header" ? (
                            <Text className="text-white font-semibold text-base mt-4 mb-2">{row.title}</Text>
                        ) : (
                            <BookingCard item={row.data} onPress={() => {
                                const original = items.find((i) => i.id === row.data.id && i.type === row.data.type);
                                if (original) handlePressItem(original);
                            }} />
                        )
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default BookingScreen;