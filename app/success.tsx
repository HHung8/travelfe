import { useAuth } from "@/src/context/AuthContext";
import { getTourById } from "@/src/services/tourService";
import { TourDetail } from "@/src/types/tour";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; };
const PUBLIC_BASE_URL = "https://your-public-domain.com/api"; 

export default function SuccessScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { tourId, bookingId, bookingCode, travelDate, guests, total } = useLocalSearchParams<{
    tourId: string; bookingId: string; bookingCode: string; travelDate: string; guests: string; total: string; paymentStatus: string;
  }>();

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tourId) return;
    fetchTour();
  }, [tourId]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      const data = await getTourById(accessToken, tourId);
      setTour(data);
    } catch (err) {
      console.log("error fetching tour on success screen", err);
    } finally {
      setLoading(false);
    }
  };

  const qrValue = `${PUBLIC_BASE_URL}/bookings/verify/${bookingId}`;

  return (
    <SafeAreaView className="flex-1 bg-[#121212] px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-20 h-20 rounded-full bg-green-500/15 items-center justify-center mb-6">
          <Ionicons name="checkmark" size={40} color="#22c55e" />
        </View>
        <Text className="text-white text-xl font-bold">Đặt tour thành công!</Text>
        <Text className="text-neutral-400 text-sm mt-2 text-center">Giao dịch đang chờ xác nhận</Text>
        
        {/* QR code */}
        <View className="bg-white rounded-2xl p-4 mt-6">
            <QRCode value={qrValue} size={160} backgroundColor="white" color="black" />
        </View>
        <Text className="text-neutral-500 text-xs mt-3 text-center">
            Xuất trình mã khi tham gia tour
        </Text>
        
        <View className="w-full bg-neutral-900 rounded-2xl p-4 mt-6">
          <Text className="text-neutral-400 text-xs text-center mb-1">Mã booking</Text>
          <Text className="text-indigo-400 font-bold text-center text-base mb-4">{bookingCode}</Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-neutral-500">Tour</Text>
              {loading ? <ActivityIndicator size="small" color="#8B5CF6" /> : <Text className="text-white">{tour?.title ?? "—"}</Text>}
            </View>
            <View className="flex-row justify-between">
              <Text className="text-neutral-500">Ngày khởi hành</Text>
              <Text className="text-white">{fmt(travelDate)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-neutral-500">Số khách</Text>
              <Text className="text-white">{guests} người</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-neutral-500">Tổng tiền</Text>
              <Text className="text-yellow-400">${total} · Đang xử lý</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="pb-8 gap-3">
        <TouchableOpacity onPress={() => router.push("/booking")} className="h-14 rounded-2xl bg-white items-center justify-center">
          <Text className="text-black font-semibold">Xem booking của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/home")} className="h-14 rounded-2xl border border-neutral-700 items-center justify-center">
          <Text className="text-white font-semibold">Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}