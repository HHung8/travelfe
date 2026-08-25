import StatusBanner from '@/src/components/booking/StatusBanner';
import SafeImage from '@/src/components/detail/SafeImage';
import { useAuth } from '@/src/context/AuthContext';
import {
    cancelHotelBooking,
    cancelTourBooking,
    getHotelBookingById,
    getTourBookingById,
} from '@/src/services/bookingService';
import { HotelBookingItem, TourBookingItem } from '@/src/types/bookingList';
// import { BookingType } from '@/src/types/payment';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

type BookingType = "tour" | "hotel";

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <View className="flex-row justify-between py-2">
        <Text className="text-neutral-500">{label}</Text>
        <Text className="text-white font-medium">{value}</Text>
    </View>
)

const BookingDetailScreen = () => {
    const { type, bookingId } = useLocalSearchParams<{ type: BookingType, bookingId: string }>();
    const router = useRouter();
    const { accessToken } = useAuth();
    const SUPPORT_PHONE = "19001234";

    const [tourBooking, setTourBooking] = useState<TourBookingItem | null>(null);
    const [hotelBooking, setHotelBooking] = useState<HotelBookingItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!bookingId || !type) return;
        fetchDetail();
    }, [bookingId, type]);

    const fetchDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            if (type === "tour") {
                const data = await getTourBookingById(accessToken, bookingId);
                setTourBooking(data);
            } else {
                const data = await getHotelBookingById(accessToken, bookingId);
                setHotelBooking(data)
            }
        } catch (error: any) {
            setError(error?.message || "Không tải được thông tin đặt chỗ")
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        );
    }

    const booking = type === "tour" ? tourBooking : hotelBooking;
    if (error || !booking) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
                <Text className="text-red-400 text-center">{error || "Không tìm thấy đặt chỗ."}</Text>
            </SafeAreaView>
        );
    }

    const title = type === "tour" ? (booking as TourBookingItem).tourTitle : (booking as HotelBookingItem).hotelName;
    const thumbnailUrl = booking.thumbnailUrl;
    const status = booking.status;
    const isPending = status === "pending";
    const isConfirmed = status === "confirmed";
    const isCompleted = status === "completed";
    const isCancelled = status === "cancelled";
    const qrValue = JSON.stringify({ bookingId: booking.id, bookingCode: booking.bookingCode, type });

    const handlePayNow = () => {
        router.push({
            pathname: "/payment",
            params: {
                existingBookingId: booking.id,
                bookingType: type,
                amount: String(booking.totalPrice),
                // thông tin hiển thị lại ở màn payment
                tourId: type === "tour" ? (booking as TourBookingItem).tourId : undefined,
                title,
                thumbnailUrl: thumbnailUrl ?? "",
            },
        });
    };

    const handleContactSupport = async () => {
       const url = `tel:${SUPPORT_PHONE}`;
       try {
            const canOpen = await Linking.canOpenURL(url);
            if(canOpen) {
                await Linking.openURL(url);
            } else {
                Alert.alert(
                    "Không thể gọi điện",
                    `Vui lòng liên hệ hotline: ${SUPPORT_PHONE}`
                )
            }
       } catch (error) {
            console.log("error opening phone dialer", error);
            Alert.alert(
                "Không thể gọi điện",
                `Vui lòng liên hệ hotline: ${SUPPORT_PHONE}`
            )
       }
    }

    const handleCancelBooking = () => {
        Alert.alert(
            "Xác nhận huỷ",
            "Bạn có chắc chắn muốn huỷ đặt chỗ này không?",
            [
                { text: "Không", style: "cancel" },
                {
                    text: "Huỷ đặt chỗ",
                    style: "destructive",
                    onPress: async () => {
                        setCancelling(true);
                        try {
                            if (type === "tour") {
                                await cancelTourBooking(accessToken, booking.id);
                            } else {
                                await cancelHotelBooking(accessToken, booking.id);
                            }
                            Alert.alert(
                                "Huỷ đặt chỗ thành công",
                                "Đặt chỗ của bạn đã được huỷ.",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            // Quay về trang danh sách booking, thay vì trang chủ,
                                            // và dùng replace để không back lại được trang detail cũ
                                            router.replace("/(root)/booking"); // TODO: sửa lại đúng path route booking list của bạn
                                        },
                                    },
                                ]
                            );
                        } catch (error: any) {
                            Alert.alert(
                                "Huỷ thất bại",
                                error?.message || "Không thể huỷ đặt chỗ, vui lòng thử lại."
                            );
                        } finally {
                            setCancelling(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "left", "right"]}>
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Chi tiết đặt chỗ</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
                <StatusBanner status={status} />

                {/* Ảnh + tên */}
                <View className="flex-row items-center bg-neutral-900 rounded-2xl p-3 mt-4">
                    <View className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-700">
                        <SafeImage uri={thumbnailUrl} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="flex-1 ml-3">
                        <Text className="text-white font-bold text-base" numberOfLines={2}>{title}</Text>
                        <Text className="text-neutral-500 text-xs mt-1">Mã: {booking.bookingCode}</Text>
                    </View>
                </View>

                {/* QR code — ẩn khi pending hoặc đã huỷ */}
                {!isPending && !isCancelled && (
                    <View className="items-center mt-6">
                        <View className="bg-white rounded-2xl p-4">
                            <QRCode value={qrValue} size={140} backgroundColor="white" color="black" />
                        </View>
                        <Text className="text-neutral-500 text-xs mt-2">Xuất trình mã này khi tham gia</Text>
                    </View>
                )}

                {/* Thông tin chi tiết */}
                <View className="bg-neutral-900 rounded-2xl p-4 mt-6">
                    <Text className="text-white font-semibold text-base mb-2">Thông tin đặt chỗ</Text>
                    {type === "tour" ? (
                        <>
                            <InfoRow label="Ngày khởi hành" value={fmtDate((booking as TourBookingItem).travelDate)} />
                            <InfoRow label="Số khách" value={`${booking.numGuests} người`} />
                        </>
                    ) : (
                        <>
                            <InfoRow label="Loại phòng" value={(booking as HotelBookingItem).roomType} />
                            <InfoRow label="Nhận phòng" value={fmtDate((booking as HotelBookingItem).checkIn)} />
                            <InfoRow label="Trả phòng" value={fmtDate((booking as HotelBookingItem).checkOut)} />
                            <InfoRow label="Số khách" value={`${booking.numGuests} người`} />
                        </>
                    )}
                    <InfoRow label="Ngày đặt" value={fmtDate(booking.createdAt)} />
                </View>

                {/* Thanh toán */}
                <View className="bg-neutral-900 rounded-2xl p-4 mt-4">
                    <Text className="text-white font-semibold text-base mb-2">Thanh toán</Text>
                    <View className="flex-row justify-between pt-2 border-t border-neutral-800">
                        <Text className="text-white font-semibold">Tổng tiền</Text>
                        <Text className="text-indigo-400 font-bold text-base">${booking.totalPrice}</Text>
                    </View>
                </View>

                {/* Chính sách huỷ / Thông tin huỷ */}
                {isCancelled ? (
                    <View className="bg-neutral-900 rounded-2xl p-4 mt-4">
                        <Text className="text-white font-semibold text-base mb-2">Thông tin huỷ</Text>
                        {(booking as any).cancelledAt && (
                            <InfoRow label="Ngày huỷ" value={fmtDate((booking as any).cancelledAt)} />
                        )}
                        {(booking as any).cancelReason && (
                            <Text className="text-neutral-400 text-sm leading-6 mt-2">
                                Lý do: {(booking as any).cancelReason}
                            </Text>
                        )}
                    </View>
                ) : (
                    <View className="bg-neutral-900 rounded-2xl p-4 mt-4">
                        <Text className="text-white font-semibold text-base mb-2">Chính sách huỷ</Text>
                        <Text className="text-neutral-400 text-sm leading-6">
                            Miễn phí huỷ trước 48 giờ so với ngày khởi hành. Huỷ trong vòng 48 giờ sẽ không được hoàn tiền.
                        </Text>
                    </View>
                )}

                {/* Hỗ trợ */}
                <TouchableOpacity
                    onPress={handleContactSupport}
                    className="flex-row items-center justify-center bg-neutral-900 rounded-2xl p-4 mt-4"
                >
                    <Ionicons name="call-outline" size={18} color="#818cf8" />
                    <Text className="text-indigo-400 font-semibold ml-2">Liên hệ hỗ trợ</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Actions theo trạng thái — ẩn hết nếu đã huỷ */}
            {!isCancelled && (
                <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900 gap-3">
                    {isPending && (
                        <TouchableOpacity onPress={handlePayNow} className="h-14 rounded-2xl bg-white items-center justify-center">
                            <Text className="text-black font-semibold text-base">Thanh toán ngay</Text>
                        </TouchableOpacity>
                    )}
                    {isCompleted && (
                        <TouchableOpacity className="h-14 rounded-2xl bg-white items-center justify-center">
                            <Text className="text-black font-semibold text-base">Đánh giá tour</Text>
                        </TouchableOpacity>
                    )}
                    {(isPending || isConfirmed) && (
                        <TouchableOpacity
                            onPress={handleCancelBooking}
                            disabled={cancelling}
                            className="h-14 rounded-2xl border border-red-500/50 items-center justify-center"
                        >
                            {cancelling ? (
                                <ActivityIndicator color="#f87171" />
                            ) : (
                                <Text className="text-red-400 font-semibold text-base">Huỷ đặt chỗ</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}

export default BookingDetailScreen