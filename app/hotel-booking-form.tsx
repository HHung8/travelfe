import DateRangePicker from "@/src/components/booking/DateRangePicker";
import PricingSummary from "@/src/components/booking/PriceSummary";
// import PricingSummary from "@/src/components/booking/PricingSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { exploreData } from "@/src/data/explore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const toISO = (d: Date) => d.toISOString().slice(0, 10);

export default function HotelBookingFormScreen() {
  const { hotelId } = useLocalSearchParams<{ hotelId: string }>();
  const router = useRouter();

  const hotel = useMemo(
    () => exploreData.find((i) => i.id === hotelId && i.type === "hotel") ?? exploreData.find((i) => i.type === "hotel")!,
    [hotelId]
  );

  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [rooms, setRooms] = useState(1);

  const nights = start && end ? Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000)) : 0;
  const price = Number(hotel.price);
  const subtotal = price * nights * rooms;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canContinue = !!start && !!end && nights > 0;

  const handleContinue = () => {
    if (!start || !end) return;
    router.push({
      pathname: "/hotel-payment",
      params: { hotelId: hotel.id, checkIn: toISO(start), checkOut: toISO(end), rooms: String(rooms) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">Chọn ngày nhận/trả phòng</Text>
      </View>

      <StepIndicator currentStep={2} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <Text className="text-neutral-400 text-sm mb-4">Chọn ngày check-in và check-out</Text>

        <DateRangePicker mode="range" start={start} end={end} onChange={(s, e) => { setStart(s); setEnd(e); }} />

        <View className="flex-row items-center justify-between bg-neutral-900 rounded-2xl p-4 mt-6">
          <View>
            <Text className="text-white font-semibold">Số phòng</Text>
            <Text className="text-neutral-500 text-xs mt-1">{nights > 0 ? `${nights} đêm` : "Chọn ngày trước"}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setRooms((r) => Math.max(1, r - 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="remove" size={16} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white w-6 text-center">{rooms}</Text>
            <TouchableOpacity onPress={() => setRooms((r) => Math.min(5, r + 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {nights > 0 && (
          <View className="mt-6">
            <PricingSummary
              rows={[
                { label: `$${hotel.price} × ${nights} đêm × ${rooms} phòng`, value: `$${subtotal}` },
                { label: "Phí dịch vụ", value: `$${serviceFee}` },
                { label: "Thuế (10%)", value: `$${tax}` },
              ]}
              total={`$${total}`}
            />
          </View>
        )}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900">
        <TouchableOpacity
          disabled={!canContinue}
          onPress={handleContinue}
          className={`h-14 rounded-2xl items-center justify-center ${canContinue ? "bg-white" : "bg-neutral-700"}`}
        >
          <Text className={`font-semibold text-base ${canContinue ? "text-black" : "text-neutral-400"}`}>Tiếp tục thanh toán</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}