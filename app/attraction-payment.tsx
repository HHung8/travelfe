import PaymentMethodSelector, { PaymentMethod } from "@/src/components/booking/PaymentMethodSelector";
import PricingSummary from "@/src/components/booking/PriceSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import SafeImage from "@/src/components/detail/SafeImage";
import { useAuth } from "@/src/context/AuthContext";
import { getAttractionById } from "@/src/services/attractionService";
import { createAttractionBooking } from "@/src/services/bookingService";
import { createPayment } from "@/src/services/paymentService";
import { AttractionDetail } from "@/src/types/attraction";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmtDate = (iso: string) => { const d = new Date(iso); return `${d.getDate}/${d.getMonth() + 1}` };

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
    card: "Số tài khoản",
    apple_pay: "Apple Pay",
    wallet: "Ví điện tử",
};

export default function AttractionPaymentScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();
    const { placeId, scheduleId, visitDate, guests, specialRequest } = useLocalSearchParams<{
        placeId: string; scheduleId: string; visitDate: string; guests: string; specialRequest?: string;
    }>();

    const [place, setPlace] = useState<AttractionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const guestCount = Number(guests) || 1;
    const [method, setMethod] = useState<PaymentMethod>("card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState<string | null>(null);

    const fetchPlace = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAttractionById(accessToken, placeId);
            setPlace(data);
        } catch (error: any) {
            setError(error?.message || "Không tải được thông tin")
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        if (!placeId) return;
        fetchPlace();
    }, [placeId]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] item-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        )
    }

    if (error || !place) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
                <Text className="text-red-400 text-center">{error || "Không tìm thấy địa điểm."}</Text>
            </SafeAreaView>
        )
    }

    const unitPrice = place.entryFee ?? 0;
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
            const booking = await createAttractionBooking(accessToken, {
                attractionId: place.id,
                scheduleId,
                numGuests: guestCount,
                specialRequest: specialRequest || undefined,
            });

            const payment = await createPayment(accessToken, {
                bookingType: "attraction" as any, // ⚠️ nếu BookingType type chỉ có "tour"|"hotel", cần mở rộng thêm "attraction"
                bookingId: booking.id,
                amount: booking.totalPrice,
                method: PAYMENT_METHOD_LABEL[method],
            });

            router.push({
                pathname: "/attraction-success",
                params: {
                    placeId: place.id,
                    bookingId: booking.id,
                    bookingCode: booking.bookingCode,
                    visitDate: booking.visitDate,
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
                        <SafeImage uri={place.thumbnailUrl} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-semibold">{place.name}</Text>
                        <Text className="text-neutral-400 text-xs mt-1">
                            Ngày {fmtDate(visitDate)} · {guestCount} vé
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

                {!!payError && <Text className="text-red-400 text-sm mt-4 text-center">{payError}</Text>}
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