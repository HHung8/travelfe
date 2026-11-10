import { useAuth } from "@/src/context/AuthContext";
import { getHotelById } from "@/src/services/hotelService";
import { HotelDetail } from "@/src/types/hotel";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import AppText from "@/src/components/common/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}` };
const PUBLIC_BASE_URL = "https://your-public-domain.com/api";

// ⚠️ map trạng thái thanh toán sang label + màu hiển thị — giống success.tsx
const PAYMENT_STATUS_META: Record<string, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  pending: { label: "Chờ xác nhận thanh toán", dotColor: "bg-yellow-400", bgColor: "bg-yellow-500/15", textColor: "text-yellow-400" },
  success: { label: "Thanh toán thành công", dotColor: "bg-green-400", bgColor: "bg-green-500/15", textColor: "text-green-400" },
  failed: { label: "Thanh toán thất bại", dotColor: "bg-red-400", bgColor: "bg-red-500/15", textColor: "text-red-400" },
  refunded: { label: "Đã hoàn tiền", dotColor: "bg-neutral-400", bgColor: "bg-neutral-500/15", textColor: "text-neutral-400" },
};

function getPaymentStatusMeta(status?: string) {
  return PAYMENT_STATUS_META[status ?? "pending"] ?? PAYMENT_STATUS_META.pending;
}

export default function HotelSuccessScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { hotelId, bookingId, roomType, checkIn, checkOut, rooms, total, bookingCode, paymentStatus } = useLocalSearchParams<{
    hotelId: string; bookingId: string; roomType: string; checkIn: string; checkOut: string; rooms: string; total: string; bookingCode: string; paymentStatus: string;
  }>();

  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    getHotelById(accessToken, hotelId).then(setHotel).finally(() => setLoading(false));
  }, [accessToken, hotelId]);


  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212] px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-20 h-20 rounded-full bg-green-500/15 items-center justify-center mb-6">
          <Ionicons name="checkmark" size={40} color="#22c55e" />
        </View>
        <AppText className="text-white text-xl font-bold">Đặt phòng thành công!</AppText>
        {(() => {
          const statusMeta = getPaymentStatusMeta(paymentStatus);
          return (
            <View className={`flex-row items-center ${statusMeta.bgColor} px-4 py-1.5 rounded-full mt-3`}>
              <View className={`w-2 h-2 rounded-full ${statusMeta.dotColor} mr-2`} />
              <AppText className={`${statusMeta.textColor} text-sm font-medium`}>{statusMeta.label}</AppText>
            </View>
          );
        })()}
        <View className="w-full bg-neutral-900 rounded-2xl p-4 mt-6">
          <AppText className="text-neutral-400 text-xs text-center mb-1">Mã đặt phòng</AppText>
          <AppText className="text-indigo-400 font-bold text-center text-base mb-4">{bookingCode}</AppText>
          <View className="gap-2">
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Khách sạn</AppText><AppText className="text-white">{hotel?.name ?? "-"}</AppText></View>
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Loại phòng</AppText><AppText className="text-white">{roomType}</AppText></View>
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Nhận/trả phòng</AppText><AppText className="text-white">{fmt(checkIn)} - {fmt(checkOut)}</AppText></View>
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Số phòng</AppText><AppText className="text-white">{rooms}</AppText></View>
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Thanh toán</AppText><AppText className="text-yellow-400">${total} · Đang xử lý</AppText></View>
          </View>
        </View>
      </View>
      <View className="pb-8 gap-3">
        <TouchableOpacity onPress={() => router.push("/booking")} className="h-14 rounded-2xl bg-white items-center justify-center">
          <AppText className="text-black font-semibold">Xem đặt phòng của tôi</AppText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/home")} className="h-14 rounded-2xl border border-neutral-700 items-center justify-center">
          <AppText className="text-white font-semibold">Về trang chủ</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}