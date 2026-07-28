import PaymentMethodSelector, { PaymentMethod } from "@/src/components/booking/PaymentMethodSelector";
import PricingSummary from "@/src/components/booking/PriceSummary";
// import PricingSummary from "@/src/components/booking/PricingSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { popularTours } from "@/src/data/home";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}`; };
const genBookingCode = () => `TRV-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 9000 + 1000)}`;

export default function PaymentScreen() {
  const router = useRouter();
  const { tourId, checkIn, checkOut, guests } = useLocalSearchParams<{ tourId: string; checkIn: string; checkOut: string; guests: string }>();
  const tour = useMemo(() => popularTours.find((t) => t.id === tourId) ?? popularTours[0], [tourId]);
  const guestCount = Number(guests) || 1;

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = tour.price * guestCount;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canPay = method !== "card" || (cardNumber.length >= 16 && expiry.length === 5 && cvv.length >= 3);

  const handlePay = async () => {
    if (!canPay || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push({
      pathname: "/success",
      params: { tourId: tour.id, checkIn, checkOut, guests: String(guestCount), total: String(total), bookingCode: genBookingCode() },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">Thanh toán</Text>
      </View>

      <StepIndicator currentStep={3} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <View className="flex-row bg-neutral-900 rounded-2xl p-3 items-center gap-3">
          <View className="w-14 h-14 rounded-xl items-center justify-center" style={{ backgroundColor: tour.color ?? "#404040" }}>
            <Text style={{ fontSize: 24 }}>{tour.emoji}</Text>
          </View>
          <View>
            <Text className="text-white font-semibold">{tour.title}</Text>
            <Text className="text-neutral-400 text-xs mt-1">{fmt(checkIn)} - {fmt(checkOut)} · {guestCount} khách</Text>
          </View>
        </View>

        <View className="mt-4">
          <PricingSummary
            rows={[
              { label: `$${tour.price} × ${guestCount}`, value: `$${subtotal}` },
              { label: "Phí + thuế", value: `$${serviceFee + tax}` },
            ]}
            totalLabel="Tổng"
            total={`$${total}`}
          />
        </View>

        <View className="mt-6">
          <PaymentMethodSelector
            method={method} onChangeMethod={setMethod}
            cardNumber={cardNumber} onChangeCardNumber={setCardNumber}
            expiry={expiry} onChangeExpiry={setExpiry}
            cvv={cvv} onChangeCvv={setCvv}
          />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900">
        <TouchableOpacity
          disabled={!canPay || loading}
          onPress={handlePay}
          className={`h-14 rounded-2xl items-center justify-center flex-row gap-2 ${canPay ? "bg-white" : "bg-neutral-700"}`}
        >
          {loading ? <ActivityIndicator color="#000" /> : (
            <>
              <Ionicons name="lock-closed" size={16} color={canPay ? "#000" : "#a3a3a3"} />
              <Text className={`font-semibold text-base ${canPay ? "text-black" : "text-neutral-400"}`}>Thanh toán ngay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}