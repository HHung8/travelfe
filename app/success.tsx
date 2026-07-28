import { popularTours } from "@/src/data/home";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; };

export default function SuccessScreen() {
  const router = useRouter();
  const { tourId, checkIn, checkOut, guests, total, bookingCode } = useLocalSearchParams<{
    tourId: string; checkIn: string; checkOut: string; guests: string; total: string; bookingCode: string;
  }>();
  const tour = useMemo(() => popularTours.find((t) => t.id === tourId) ?? popularTours[0], [tourId]);

  return (
    <SafeAreaView className="flex-1 bg-[#121212] px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-20 h-20 rounded-full bg-green-500/15 items-center justify-center mb-6">
          <Ionicons name="checkmark" size={40} color="#22c55e" />
        </View>
        <Text className="text-white text-xl font-bold">Đặt tour thành công!</Text>
        <Text className="text-neutral-400 text-sm mt-2 text-center">Xác nhận đã được gửi đến email của bạn</Text>

        <View className="w-full bg-neutral-900 rounded-2xl p-4 mt-6">
          <Text className="text-neutral-400 text-xs text-center mb-1">Mã booking</Text>
          <Text className="text-indigo-400 font-bold text-center text-base mb-4">{bookingCode}</Text>
          <View className="gap-2">
            <View className="flex-row justify-between"><Text className="text-neutral-500">Tour</Text><Text className="text-white">{tour.title}</Text></View>
            <View className="flex-row justify-between"><Text className="text-neutral-500">Ngày đi</Text><Text className="text-white">{fmt(checkIn)} - {fmt(checkOut)}</Text></View>
            <View className="flex-row justify-between"><Text className="text-neutral-500">Số khách</Text><Text className="text-white">{guests} người</Text></View>
            <View className="flex-row justify-between"><Text className="text-neutral-500">Thanh toán</Text><Text className="text-green-400">${total} · Thành công</Text></View>
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