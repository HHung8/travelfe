import { exploreData } from "@/src/data/explore";
import { showSuccessToast } from "@/src/utils/apiSuccessToast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "@/src/components/common/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`; };

export default function TicketSuccessScreen() {
  const router = useRouter();
  const { placeId, visitDate, tickets, total, bookingCode } = useLocalSearchParams<{
    placeId: string; visitDate: string; tickets: string; total: string; bookingCode: string;
  }>();
  const place = useMemo(
    () => exploreData.find((i) => i.id === placeId && i.type === "attraction") ?? exploreData.find((i) => i.type === "attraction")!,
    [placeId]
  );

  useEffect(() => {
    showSuccessToast("Mua vé thành công!");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#121212] px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-20 h-20 rounded-full bg-green-500/15 items-center justify-center mb-6">
          <Ionicons name="checkmark" size={40} color="#22c55e" />
        </View>
        <AppText className="text-white text-xl font-bold">Mua vé thành công!</AppText>
        <AppText className="text-neutral-400 text-sm mt-2 text-center">Xác nhận đã được gửi đến email của bạn</AppText>

        <View className="w-full bg-neutral-900 rounded-2xl p-4 mt-6">
          <AppText className="text-neutral-400 text-xs text-center mb-1">Mã vé</AppText>
          <AppText className="text-indigo-400 font-bold text-center text-base mb-4">{bookingCode}</AppText>
          <View className="gap-2">
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Địa điểm</AppText><AppText className="text-white">{place.title}</AppText></View>
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Ngày tham quan</AppText><AppText className="text-white">{fmt(visitDate)}</AppText></View>
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Số vé</AppText><AppText className="text-white">{tickets}</AppText></View>
            <View className="flex-row justify-between"><AppText className="text-neutral-500">Thanh toán</AppText><AppText className="text-green-400">${total} · Thành công</AppText></View>
          </View>
        </View>
      </View>

      <View className="pb-8 gap-3">
        <TouchableOpacity onPress={() => router.push("/booking")} className="h-14 rounded-2xl bg-white items-center justify-center">
          <AppText className="text-black font-semibold">Xem vé của tôi</AppText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/home")} className="h-14 rounded-2xl border border-neutral-700 items-center justify-center">
          <AppText className="text-white font-semibold">Về trang chủ</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}