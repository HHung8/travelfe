import DateRangePicker from "@/src/components/booking/DateRangePicker";
import PricingSummary from "@/src/components/booking/PriceSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { popularTours } from "@/src/data/home";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const toISO = (d: Date) => d.toISOString().slice(0, 10);

export default function BookingFormScreen() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  const router = useRouter();

  const tour = useMemo(() => popularTours.find((t) => t.id === tourId) ?? popularTours[0], [tourId]);

  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);

  const subtotal = tour.price * guests;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canContinue = !!start && !!end;

  const handleContinue = () => {
    if (!start || !end) return;
    router.push({
      pathname: "/payment",
      params: { tourId: tour.id, checkIn: toISO(start), checkOut: toISO(end), guests: String(guests) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">Chọn ngày đi</Text>
      </View>

      <StepIndicator currentStep={2} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <Text className="text-neutral-400 text-sm mb-4">Chọn ngày bắt đầu và kết thúc</Text>

        <DateRangePicker mode="range" start={start} end={end} onChange={(s, e) => { setStart(s); setEnd(e); }} />

        <View className="flex-row items-center justify-between bg-neutral-900 rounded-2xl p-4 mt-6">
          <View>
            <Text className="text-white font-semibold">Số khách</Text>
            <Text className="text-neutral-500 text-xs mt-1">Tối đa {tour.maxGuests ?? 20} người</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setGuests((g) => Math.max(1, g - 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="remove" size={16} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white w-6 text-center">{guests}</Text>
            <TouchableOpacity onPress={() => setGuests((g) => Math.min(tour.maxGuests ?? 20, g + 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6">
          <PricingSummary
            rows={[
              { label: `$${tour.price} × ${guests} khách`, value: `$${subtotal}` },
              { label: "Phí dịch vụ", value: `$${serviceFee}` },
              { label: "Thuế (10%)", value: `$${tax}` },
            ]}
            total={`$${total}`}
          />
        </View>
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