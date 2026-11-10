import PaymentMethodSelector, { PaymentMethod } from "@/src/components/booking/PaymentMethodSelector";
import PaymentSimulationPanel from "@/src/components/booking/PaymentSimulationPanel";
import PricingSummary from "@/src/components/booking/PriceSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { useAuth } from "@/src/context/AuthContext";
import { createHotelBooking } from "@/src/services/bookingService";
import { getHotelById } from "@/src/services/hotelService";
import { confirmPayment, createPayment, failPayment, PaymentSimulationOutcome, processDevelopmentPayment } from "@/src/services/paymentService";
import { getPaymentMethods } from "@/src/services/paymentMethodService";
import { HotelDetail } from "@/src/types/hotel";
import type { PaymentMethodItem } from "@/src/types/paymentMethod";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import AppText from "@/src/components/common/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

const fmt = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}`};
const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  card: "Thẻ ngân hàng",
  apple_pay: "Apple Pay",
  wallet: "Ví điện tử",
}



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
  const [payError, setPayError] = useState<string | null> (null);
  const [simulationOutcome, setSimulationOutcome] = useState<PaymentSimulationOutcome>("success");
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const bookingRef = useRef<Awaited<ReturnType<typeof createHotelBooking>> | null>(null);
  const [savedCards, setSavedCards] = useState<PaymentMethodItem[]>([]);
  const [selectedSavedCardId, setSelectedSavedCardId] = useState<string | null>(null);
  const [savedCardsError, setSavedCardsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPaymentMethods(accessToken).then((cards) => {
      if (!active) return;
      setSavedCards(cards);
      setSelectedSavedCardId(cards.find((card) => card.isDefault)?.id ?? null);
    }).catch((err: unknown) => {
      if (active) setSavedCardsError(err instanceof Error ? err.message : "Không tải được thẻ đã lưu");
    });
    return () => {
      active = false;
    };
  }, [accessToken]);

  const price = room?.pricePerNight ?? 0;
  const subtotal = price * nights * roomCount;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canPay = !!room && (method !== "card" ||
    (selectedSavedCardId !== null && savedCards.some((card) => card.id === selectedSavedCardId)) ||
    (cardNumber.length >= 16 && expiry.length === 5 && cvv.length >= 3));
  const selectedSavedCard = savedCards.find((card) => card.id === selectedSavedCardId);
  const paymentMethodLabel = method === "card" && selectedSavedCard
    ? `${selectedSavedCard.brand} •••• ${selectedSavedCard.last4}`
    : PAYMENT_METHOD_LABEL[method];

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
        <AppText className="text-red-400 text-center mb-4">{error ?? "Không tìm thấy thông tin phòng"}</AppText>
        <TouchableOpacity onPress={loadHotel} className="bg-white rounded-2xl px-6 py-3">
          <AppText className="text-black font-semibold">Thử lại</AppText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handlePay = async () => {
    if(!canPay || paying) return;
    setPaying(true);
    setPayError(null);
    setSimulationNotice(null);

    let paymentId: string | null = null;
    try {
      const booking = bookingRef.current ?? await createHotelBooking(accessToken, {
        roomId, checkIn, checkOut, numGuests: roomCount
      });
      bookingRef.current = booking;

      const payment = await createPayment(accessToken, {
        bookingType: "hotel",
        bookingId: booking.id,
        amount: booking.totalPrice,
        method: paymentMethodLabel,
      });
      paymentId = payment.id;

      const confirmed = __DEV__
        ? await processDevelopmentPayment(accessToken, payment.id, simulationOutcome, paymentMethodLabel)
        : { outcome: "success" as const, payment: await confirmPayment(accessToken, payment.id, {
            transactionRef: `TNX${Date.now()}`,
            gatewayResponse: JSON.stringify({ status: "success", method }),
          }) };
      if (confirmed.outcome !== "success") {
        setSimulationNotice(
          `Booking ${booking.bookingCode} · giao dịch ${payment.id}: đã gọi API fail với kịch bản ${confirmed.outcome === "failure" ? "thất bại" : "người dùng huỷ"}. Không có tiền thật được xử lý.`
        );
        return;
      }

      router.push({
        pathname: "/hotel-success",
        params: {
          hotelId: hotel.id,
          bookingId: booking.id,
          bookingCode: booking.bookingCode,
          roomType: booking.roomType,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          rooms: String(roomCount),
          total: String(booking.totalPrice),
          paymentStatus: confirmed.payment.status,
        },
      });
    } catch (err: any) {
      if (paymentId) {
        await failPayment(accessToken, paymentId, {
          gatewayResponse: JSON.stringify({ status: "failed", environment: __DEV__ ? "development" : "production" }),
        }).catch(() => {});
      }
      setPayError(err?.message || "Đặt phòng/thanh toán thất bại, vui lòng thử lại.")
    } finally {
      setPaying(false);
    }
  };

  return (
   <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <AppText className="text-white text-lg font-semibold ml-2">Thanh toán</AppText>
      </View>
      <StepIndicator currentStep={3} />
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <View className="flex-row bg-neutral-900 rounded-2xl p-3 items-center gap-3">
          <View className="w-14 h-14 rounded-xl items-center justify-center bg-neutral-800">
            <AppText style={{ fontSize: 24 }}>🏨</AppText>
          </View>
          <View>
            <AppText className="text-white font-semibold">{hotel.name}</AppText>
            <AppText className="text-neutral-400 text-xs mt-1">{room.roomType} · {fmt(checkIn)} - {fmt(checkOut)} · {roomCount} phòng</AppText>
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
            savedCards={savedCards}
            selectedSavedCardId={selectedSavedCardId}
            onChangeSavedCard={setSelectedSavedCardId}
          />
        </View>
        {!!savedCardsError && <AppText className="mt-2 text-xs text-amber-300">{savedCardsError} Bạn vẫn có thể nhập thẻ demo.</AppText>}
        {__DEV__ && (
          <PaymentSimulationPanel outcome={simulationOutcome} onChangeOutcome={setSimulationOutcome} />
        )}
        {!!simulationNotice && (
          <View className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
            <AppText className="text-amber-200 text-sm leading-5">{simulationNotice}</AppText>
          </View>
        )}
        {!!payError && (
          <AppText className="mt-4 text-center text-sm text-red-400">{payError}</AppText>
        )}

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
              <AppText className={`font-semibold text-base ${canPay ? "text-black" : "text-neutral-400"}`}>Đặt phòng ngay</AppText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}