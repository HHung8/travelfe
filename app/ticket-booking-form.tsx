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

export default function TicketBookingFormScreen() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const router = useRouter();

  const place = useMemo(
    () => exploreData.find((i) => i.id === placeId && i.type === "attraction") ?? exploreData.find((i) => i.type === "attraction")!,
    [placeId]
  );

  const [visitDate, setVisitDate] = useState<Date | null>(null);
  const [tickets, setTickets] = useState(1);

  const price = typeof place.price === "number" ? place.price : Number(place.price);
  const subtotal = price * tickets;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canContinue = !!visitDate;

  const handleContinue = () => {
    if (!visitDate) return;
    router.push({
      pathname: "/ticket-payment",
      params: { placeId: place.id, visitDate: toISO(visitDate), tickets: String(tickets) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">Chọn ngày tham quan</Text>
      </View>

      <StepIndicator currentStep={2} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <Text className="text-neutral-400 text-sm mb-4">Chọn ngày bạn muốn tham quan</Text>

        <DateRangePicker mode="single" start={visitDate} end={visitDate} onChange={(s) => setVisitDate(s)} />

        <View className="flex-row items-center justify-between bg-neutral-900 rounded-2xl p-4 mt-6">
          <Text className="text-white font-semibold">Số vé</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setTickets((t) => Math.max(1, t - 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="remove" size={16} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white w-6 text-center">{tickets}</Text>
            <TouchableOpacity onPress={() => setTickets((t) => Math.min(10, t + 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6">
          <PricingSummary
            rows={[
              { label: `$${place.price} × ${tickets} vé`, value: `$${subtotal}` },
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