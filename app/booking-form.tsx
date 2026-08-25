import PricingSummary from "@/src/components/booking/PriceSummary";
import ScheduleCard from "@/src/components/booking/ScheduleCard";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { useAuth } from "@/src/context/AuthContext";
import { getSchedulesByTour } from "@/src/services/scheduleService";
import { getTourById } from "@/src/services/tourService";
import { TourSchedule } from "@/src/types/schedule";
import { TourDetail } from "@/src/types/tour";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingFormScreen() {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [schedules, setSchedules] = useState<TourSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");

  useEffect(() => {
    if (!tourId) return;
    fetchData();
  }, [tourId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tourData, scheduleList] = await Promise.all([
        getTourById(accessToken, tourId),
        getSchedulesByTour(accessToken, tourId),
      ]);
      setTour(tourData);
      setSchedules(scheduleList);
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

  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId) ?? null;
  const unitPrice = selectedSchedule?.overridePrice ?? tour.discountPrice ?? tour.price;
  const maxGuests = selectedSchedule?.availableSlots ?? tour.maxCapacity;

  const subtotal = unitPrice * guests;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canContinue = !!selectedSchedule && guests > 0 && guests <= maxGuests;

  const handleContinue = () => {
    if (!selectedSchedule) return;
    router.push({
      pathname: "/payment",
      params: {
        tourId: tour.id,
        scheduleId: selectedSchedule.id,
        travelDate: selectedSchedule.startDate,
        guests: String(guests),
        specialRequest,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">Chọn lịch khởi hành</Text>
      </View>

      <StepIndicator currentStep={2} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <Text className="text-neutral-400 text-sm mb-4">Chọn ngày khởi hành phù hợp</Text>

        {schedules.length === 0 ? (
          <Text className="text-neutral-500">Chưa có lịch khởi hành nào cho tour này</Text>
        ) : (
          schedules.map((s) => (
            <ScheduleCard
              key={s.id}
              schedule={s}
              basePrice={tour.price}
              selected={s.id === selectedScheduleId}
              onPress={() => {
                setSelectedScheduleId(s.id);
                setGuests(1); // reset số khách khi đổi lịch, tránh vượt quá số chỗ lịch mới
              }}
            />
          ))
        )}

        {selectedSchedule && (
          <>
            <View className="flex-row items-center justify-between bg-neutral-900 rounded-2xl p-4 mt-2">
              <View>
                <Text className="text-white font-semibold">Số khách</Text>
                <Text className="text-neutral-500 text-xs mt-1">Còn {selectedSchedule.availableSlots} chỗ</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center"
                >
                  <Ionicons name="remove" size={16} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white w-6 text-center">{guests}</Text>
                <TouchableOpacity
                  onPress={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                  className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center"
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-neutral-500 text-xs mb-1">Yêu cầu đặc biệt (không bắt buộc)</Text>
              <TextInput
                value={specialRequest}
                onChangeText={setSpecialRequest}
                placeholder="Ví dụ: ăn chay, cần xe lăn..."
                placeholderTextColor="#525252"
                multiline
                className="bg-neutral-900 text-white rounded-xl px-4 py-3 min-h-[60px]"
              />
            </View>

            <View className="mt-6">
              <PricingSummary
                rows={[
                  { label: `$${unitPrice} × ${guests} khách`, value: `$${subtotal}` },
                  { label: "Phí dịch vụ", value: `$${serviceFee}` },
                  { label: "Thuế (10%)", value: `$${tax}` },
                ]}
                total={`$${total}`}
              />
            </View>
          </>
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