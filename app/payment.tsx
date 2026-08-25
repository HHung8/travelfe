import PaymentMethodSelector, { PaymentMethod } from "@/src/components/booking/PaymentMethodSelector";
import PricingSummary from "@/src/components/booking/PriceSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import SafeImage from "@/src/components/detail/SafeImage";
import { useAuth } from "@/src/context/AuthContext";
import { createTourBooking } from "@/src/services/bookingService";
import { createPayment } from "@/src/services/paymentService";
import { getTourById } from "@/src/services/tourService";
import { TourDetail } from "@/src/types/tour";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmtDate = (iso: string) => { const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}`; };

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  card: "Số tài khoản",
  apple_pay: "Apple Pay",
  wallet: "Ví điện tử",
};

export default function PaymentScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { tourId, scheduleId, travelDate, guests, specialRequest } = useLocalSearchParams<{
    tourId: string; scheduleId: string; travelDate: string; guests: string; specialRequest?: string;
  }>();

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const guestCount = Number(guests) || 1;

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) return;
    fetchTour();
  }, [tourId]);

  const fetchTour = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTourById(accessToken, tourId);
      setTour(data);
    } catch (err: any) {
      setError(err?.message || "Không tải được thông tin tour");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color="#8B5CF6" size="large" />
      </SafeAreaView>
    );
  }

  if (error || !tour) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
        <Text className="text-red-400 text-center">{error || "Không tìm thấy tour."}</Text>
      </SafeAreaView>
    );
  }

  const unitPrice = tour.discountPrice != null && tour.discountPrice < tour.price ? tour.discountPrice : tour.price;
  const subtotal = unitPrice * guestCount;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canPay = method !== "card" || (cardNumber.length >= 16 && expiry.length === 5 && cvv.length >= 3);

  const handlePay = async () => {
    if (!canPay || paying) return;
    setPaying(true);
    setPayError(null);

    try {
      // Bước 1: tạo booking
      const booking = await createTourBooking(accessToken, {
        tourId: tour.id,
        scheduleId,
        numGuests: guestCount,
        travelDate,
        specialRequest: specialRequest || undefined,
      });

      // Bước 2: tạo thanh toán dựa trên bookingId vừa tạo
      const payment = await createPayment(accessToken, {
        bookingType: "tour",
        bookingId: booking.id,
        amount: booking.totalPrice,
        method: PAYMENT_METHOD_LABEL[method],
      });

      router.push({
        pathname: "/success",
        params: {
          tourId: tour.id,
          bookingId: booking.id,
          bookingCode: booking.bookingCode,
          travelDate: booking.travelDate,
          guests: String(booking.numGuests),
          total: String(booking.totalPrice),
          paymentStatus: payment.status,
        },
      });
    } catch (err: any) {
      setPayError(err?.message || "Thanh toán thất bại, vui lòng thử lại.");
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
        <Text className="text-white text-lg font-semibold ml-2">Thanh toán</Text>
      </View>

      <StepIndicator currentStep={3} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <View className="flex-row bg-neutral-900 rounded-2xl p-3 items-center gap-3">
          <View className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-700">
            <SafeImage uri={tour.thumbnailUrl} className="w-full h-full" resizeMode="cover" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold">{tour.title}</Text>
            <Text className="text-neutral-400 text-xs mt-1">
              Khởi hành {fmtDate(travelDate)} · {guestCount} khách
            </Text>
          </View>
        </View>

        <View className="mt-4">
          <PricingSummary
            rows={[
              { label: `$${unitPrice} × ${guestCount}`, value: `$${subtotal}` },
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

        {!!payError && (
          <Text className="text-red-400 text-sm mt-4 text-center">{payError}</Text>
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
              <Text className={`font-semibold text-base ${canPay ? "text-black" : "text-neutral-400"}`}>Thanh toán ngay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}