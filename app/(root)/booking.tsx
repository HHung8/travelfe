import BookingSection from '@/src/components/booking/BookingSection'
import { useAuth } from '@/src/context/AuthContext'
import { getHotelBookings, getTourBookings } from '@/src/services/bookingService'
import { UnifiedBookingItem } from '@/src/types/bookingList'
import { getStatusMeta } from '@/src/utils/bookingStatus'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};
const BookingScreen = () => {
    const router = useRouter();
    const { accessToken } = useAuth();

    const [items, setItems] = useState<UnifiedBookingItem[]>([]);
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
            ]);
            const tourItems: UnifiedBookingItem[] = tourBookings.map((b) => ({
                id: b.id,
                type: "tour",
                refId: b.tourId,
                title: b.tourTitle,
                dateLabel: `Khởi hành: ${fmtDate(b.travelDate)}`,
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
                thumbnailUrl: b.thumbnailUrl,
                totalPrice: b.totalPrice,
                status: b.status,
                bookingCode: b.bookingCode,
            }));

            const all = [...tourItems, ...hotelItems].sort(
                (a, b) => new Date(b.dateLabel).getTime() - new Date(a.dateLabel).getTime()
            );
            setItems(all);
        } catch (err: any) {
            setError(err?.message || "Không tải được danh sách booking")
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings])

    const handlePressItem = (item: UnifiedBookingItem) => {
        router.push({
            pathname: "/booking-detail",
            params: {type:item.type, bookingId: item.id},
        });
    };

    const statusGroups = Array.from(new Set(items.map((i) => i.status)));

    if (loading) {
        <SafeAreaView className='flex-1 bg-[#121212] items-center justify-center'>
            <ActivityIndicator color="#8B5CF6" size="large" />
        </SafeAreaView>
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <ScrollView
                className="px-6"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchBookings(true)} tintColor="#8B5CF6" />}
            >
                <Text className="text-white text-4xl font-bold mt-4 mb-8">Booking của tôi</Text>

                {error && <Text className="text-red-400 mb-4">{error}</Text>}

                {items.length === 0 && !error ? (
                    <Text className="text-neutral-500">Bạn chưa có booking nào</Text>
                ) : (
                    statusGroups.map((status) => {
                        const meta = getStatusMeta(status);
                        const data = items
                            .filter((i) => i.status === status)
                            .map((i) => ({
                                id: i.id,
                                type: i.type,
                                refId: i.refId,
                                title: i.title,
                                date: i.dateLabel,
                                thumbnailUrl: i.thumbnailUrl,
                                badge: meta.label,
                                badgeColor: meta.badgeColor,
                                badgeText: meta.badgeText,
                            }));

                        return (
                            <BookingSection
                                key={status}
                                title={meta.label}
                                data={data}
                                onPressItem={handlePressItem}
                            />
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default BookingScreen