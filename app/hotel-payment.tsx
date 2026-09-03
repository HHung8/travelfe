import PaymentMethodSelector, { PaymentMethod } from "@/src/components/booking/PaymentMethodSelector";
import PricingSummary from "@/src/components/booking/PriceSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { useAuth } from "@/src/context/AuthContext";
import { getHotelById } from "@/src/services/hotelService";
import { HotelDetail } from "@/src/types/hotel";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}`; };
const genBookingCode = () => `HTL-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 9000 + 1000)}`;

export default function HotelPaymentScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { hotelId, roomId, checkIn, checkOut, rooms } = useLocalSearchParams<{ hotelId: string; roomId: string; checkIn: string; checkOut: string; rooms: string; }>();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHotel = useCallback(async () => {
    if (!hotelId) return;
    try {
      setError(null);
      setLoading(true);
      const data = await getHotelById(accessToken, hotelId);
      setHotel(data);
    } catch (e: any) {
      setError(e?.message ?? "Không thể tải thông tin khách sạn");
    } finally {
      setLoading(false);
    }
  }, [accessToken, hotelId]);

  useEffect(() => {
    loadHotel();
  }, [loadHotel]);

  const room = useMemo(() => hotel?.rooms?.find(r => r.id === roomId) ?? null, [hotel, roomId]);
  const roomCount = Number(rooms) || 1;
  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);

  const price = room?.pricePerNight ?? 0;
  const subtotal = price * nights * roomCount;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canPay = !!room && (method !== "card" || (cardNumber.length >= 16 && expiry.length === 5 && cvv.length >= 3));

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    )
  }

  if (error || !hotel || !room) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
        <Text className="text-red-400 text-center mb-4">{error ?? "Không tìm thấy thông tin phòng"}</Text>
        <TouchableOpacity onPress={loadHotel} className="bg-white rounded-2xl px-6 py-3">
          <Text className="text-black font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handlePay = async () => {
    if (!canPay || paying) return;
    setPaying(true);
    // TODO: replace with a real call once a "create booking" endpoint exists, e.g.
    // await createHotelBooking(accessToken, { hotelId, roomId, checkIn, checkOut, rooms: roomCount, ...cardInfo })
    await new Promise((r) => setTimeout(r, 1200));
    setPaying(false);
    router.push({
      pathname: "/hotel-success",
      params: {
        hotelId: hotel.id,
        roomType: room.roomType,
        checkIn, checkOut,
        rooms: String(roomCount),
        total: String(total),
        bookingCode: genBookingCode(),
      },
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
          <View className="w-14 h-14 rounded-xl items-center justify-center bg-neutral-800">
            <Text style={{ fontSize: 24 }}>🏨</Text>
          </View>
          <View>
            <Text className="text-white font-semibold">{hotel.name}</Text>
            <Text className="text-neutral-400 text-xs mt-1">{room.roomType} · {fmt(checkIn)} - {fmt(checkOut)} · {roomCount} phòng</Text>
          </View>
        </View>

        <View className="mt-4">
          <PricingSummary
            rows={[
              { label: `$${price} × ${nights} đêm × ${roomCount}`, value: `$${subtotal}` },
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
          disabled={!canPay || paying}
          onPress={handlePay}
          className={`h-14 rounded-2xl items-center justify-center flex-row gap-2 ${canPay ? "bg-white" : "bg-neutral-700"}`}
        >
          {paying ? <ActivityIndicator color="#000" /> : (
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