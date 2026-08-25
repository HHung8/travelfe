import PaymentMethodSelector, { PaymentMethod } from "@/src/components/booking/PaymentMethodSelector";
import PricingSummary from "@/src/components/booking/PriceSummary";
// import PricingSummary from "@/src/components/booking/PricingSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { exploreData } from "@/src/data/explore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}`; };
const genBookingCode = () => `HTL-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 9000 + 1000)}`;

export default function HotelPaymentScreen() {
  const router = useRouter();
  const { hotelId, checkIn, checkOut, rooms } = useLocalSearchParams<{ hotelId: string; checkIn: string; checkOut: string; rooms: string }>();
  const hotel = useMemo(
    () => exploreData.find((i) => i.id === hotelId && i.type === "hotel") ?? exploreData.find((i) => i.type === "hotel")!,
    [hotelId]
  );
  const roomCount = Number(rooms) || 1;
  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const price = Number(hotel.price) || 0;
  const subtotal = price * nights * roomCount;
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
      pathname: "/hotel-success",
      params: { hotelId: hotel.id, checkIn, checkOut, rooms: String(roomCount), total: String(total), bookingCode: genBookingCode() },
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
          <View className="w-14 h-14 rounded-xl items-center justify-center" style={{ backgroundColor: hotel.color }}>
            <Text style={{ fontSize: 24 }}>{hotel.emoji}</Text>
          </View>
          <View>
            <Text className="text-white font-semibold">{hotel.title}</Text>
            <Text className="text-neutral-400 text-xs mt-1">{fmt(checkIn)} - {fmt(checkOut)} · {roomCount} phòng</Text>
          </View>
        </View>

        <View className="mt-4">
          <PricingSummary
            rows={[
              { label: `$${hotel.price} × ${nights} đêm × ${roomCount}`, value: `$${subtotal}` },
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
              <Text className={`font-semibold text-base ${canPay ? "text-black" : "text-neutral-400"}`}>Đặt phòng ngay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}