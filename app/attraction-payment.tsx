import PaymentMethodSelector, { PaymentMethod } from "@/src/components/booking/PaymentMethodSelector";
import PaymentSimulationPanel from "@/src/components/booking/PaymentSimulationPanel";
import PricingSummary from "@/src/components/booking/PriceSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import SafeImage from "@/src/components/detail/SafeImage";
import { useAuth } from "@/src/context/AuthContext";
import { getAttractionById } from "@/src/services/attractionService";
import { createAttractionBooking } from "@/src/services/bookingService";
import { confirmPayment, createPayment, failPayment, PaymentSimulationOutcome, processDevelopmentPayment } from "@/src/services/paymentService";
import { getPaymentMethods } from "@/src/services/paymentMethodService";
import { AttractionDetail } from "@/src/types/attraction";
import type { PaymentMethodItem } from "@/src/types/paymentMethod";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}`;
};

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
    card: "Thẻ ngân hàng",
    apple_pay: "Apple Pay",
    wallet: "Ví điện tử",
};

type AttractionBooking = Awaited<ReturnType<typeof createAttractionBooking>>

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
    const [simulationOutcome, setSimulationOutcome] = useState<PaymentSimulationOutcome>("success");
    const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

    const bookingRef = useRef<AttractionBooking | null>(null);
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
 
    const fetchPlace = useCallback(async () => {
        if (!placeId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAttractionById(accessToken, placeId);
            setPlace(data);
        } catch (error: any) {
            setError(error?.message || "Không tải được thông tin");
        } finally {
            setLoading(false);
        }
    }, [accessToken, placeId]);
 
    useEffect(() => {
        fetchPlace();
    }, [fetchPlace]);
 
    if (loading) {
        return (
            // Sửa lỗi cũ: "item-center" -> "items-center"
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        );
    }
 
    if (error || !place) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
                <Text className="text-red-400 text-center mb-4">{error || "Không tìm thấy địa điểm."}</Text>
                <TouchableOpacity onPress={fetchPlace} className="bg-white rounded-2xl px-6 py-3">
                    <Text className="text-black font-semibold">Thử lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
 
    const unitPrice = place.entryFee ?? 0;
    const subtotal = unitPrice * guestCount;
    const serviceFee = Math.round(subtotal * 0.05);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + serviceFee + tax;
    const canPay = method !== "card" ||
        (selectedSavedCardId !== null && savedCards.some((card) => card.id === selectedSavedCardId)) ||
        (cardNumber.length >= 16 && expiry.length === 5 && cvv.length >= 3);
    const selectedSavedCard = savedCards.find((card) => card.id === selectedSavedCardId);
    const paymentMethodLabel = method === "card" && selectedSavedCard
        ? `${selectedSavedCard.brand} •••• ${selectedSavedCard.last4}`
        : PAYMENT_METHOD_LABEL[method];

    const handlePay = async () => {
        if (!canPay || paying) return;
        setPaying(true);
        setPayError(null);
        setSimulationNotice(null);
 
        let paymentId: string | null = null;
        try {
            // 1. Tạo booking (hoặc dùng lại booking của lần bấm trước)
            let booking = bookingRef.current;
            if (!booking) {
                booking = await createAttractionBooking(accessToken, {
                    attractionId: place.id,
                    scheduleId,
                    numGuests: guestCount,
                    specialRequest: specialRequest || undefined,
                });
                bookingRef.current = booking;
            }
 
            const payment = await createPayment(accessToken, {
                bookingType: "attraction",
                bookingId: booking.id,
                amount: booking.totalPrice,
                method: paymentMethodLabel,
            });
            paymentId = payment.id;
 
            const confirmed = __DEV__
                ? await processDevelopmentPayment(accessToken, payment.id, simulationOutcome, paymentMethodLabel)
                : { outcome: "success" as const, payment: await confirmPayment(accessToken, payment.id, {
                    transactionRef: `TXN${Date.now()}`,
                    gatewayResponse: JSON.stringify({ status: "success", method }),
                }) };
            if (confirmed.outcome !== "success") {
                setSimulationNotice(
                    `Booking ${booking.bookingCode} · giao dịch ${payment.id}: đã gọi API fail với kịch bản ${confirmed.outcome === "failure" ? "thất bại" : "người dùng huỷ"}. Không có tiền thật được xử lý.`
                );
                return;
            }
 
            router.push({
                pathname: "/attraction-success",
                params: {
                    placeId: place.id,
                    bookingId: booking.id,
                    bookingCode: booking.bookingCode,
                    visitDate: booking.visitDate,
                    guests: String(booking.numGuests),
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
                        savedCards={savedCards}
                        selectedSavedCardId={selectedSavedCardId}
                        onChangeSavedCard={setSelectedSavedCardId}
                    />
                </View>
                {!!savedCardsError && <Text className="mt-2 text-xs text-amber-300">{savedCardsError} Bạn vẫn có thể nhập thẻ demo.</Text>}
                {__DEV__ && (
                    <PaymentSimulationPanel outcome={simulationOutcome} onChangeOutcome={setSimulationOutcome} />
                )}
                {!!simulationNotice && (
                    <View className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
                        <Text className="text-amber-200 text-sm leading-5">{simulationNotice}</Text>
                    </View>
                )}
                {!!payError && (
                    <Text className="mt-4 text-center text-sm text-red-400">{payError}</Text>
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