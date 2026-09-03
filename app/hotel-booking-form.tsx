import DateRangePicker from "@/src/components/booking/DateRangePicker";
import PricingSummary from "@/src/components/booking/PriceSummary";
import StepIndicator from "@/src/components/booking/StepIndicator";
import { useAuth } from "@/src/context/AuthContext";
import { getHotelById } from "@/src/services/hotelService";
import { HotelDetail } from "@/src/types/hotel";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const toISO = (d: Date) => d.toISOString().slice(0, 10);

export default function HotelBookingFormScreen() {
  const { hotelId } = useLocalSearchParams<{ hotelId: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();

  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [rooms, setRooms] = useState(1);

  const loadHotel = useCallback(async () => {
    if (!hotelId) return;
    try {
      setError(null);
      setLoading(true);
      const data = await getHotelById(accessToken, hotelId);
      setHotel(data);
      if (data?.rooms?.length) setSelectedRoomId(data.rooms[0].id);
    } catch (e: any) {
      setError(e?.message ?? "Không thể tải thông tin khách sạn");
    } finally {
      setLoading(false);
    }
  }, [accessToken, hotelId]);

  useEffect(() => {
    loadHotel();
  }, [loadHotel]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    );
  }

  if (error || !hotel) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
        <Text className="text-red-400 text-center mb-4">{error ?? "Không tìm thấy khách sạn"}</Text>
        <TouchableOpacity onPress={loadHotel} className="bg-white rounded-2xl px-6 py-3">
          <Text className="text-black font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const selectedRoom = hotel.rooms?.find((r) => r.id === selectedRoomId) ?? null;
  const nights = start && end ? Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000)) : 0;
  const price = selectedRoom?.pricePerNight ?? 0;
  const subtotal = price * nights * rooms;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + tax;
  const canContinue = !!start && !!end && nights > 0 && !!selectedRoom;

  const handleContinue = () => {
    if (!start || !end || !selectedRoom) return;
    router.push({
      pathname: "/hotel-payment",
      params: {
        hotelId: hotel.id,
        roomId: selectedRoom.id,
        checkIn: toISO(start),
        checkOut: toISO(end),
        rooms: String(rooms),
      },
    });
  };

  return (
  <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-row items-center px-4 pt-2">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-2">Chọn phòng &amp; ngày</Text>
      </View>

      <StepIndicator currentStep={2} />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} className="px-6">
        <Text className="text-white font-semibold mb-2">Loại phòng</Text>
        <View className="gap-2 mb-6">
          {hotel.rooms?.map((room) => {
            const active = room.id === selectedRoomId;
            return (
              <TouchableOpacity
                key={room.id}
                disabled={!room.isAvailable}
                onPress={() => setSelectedRoomId(room.id)}
                className={`rounded-2xl p-3 border ${active ? "border-white bg-neutral-800" : "border-neutral-800 bg-neutral-900"} ${!room.isAvailable ? "opacity-40" : ""}`}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 pr-2">
                    <Text className="text-white font-medium">{room.roomType}</Text>
                    <Text className="text-neutral-500 text-xs mt-1">
                      {room.capacity} khách{!room.isAvailable ? " · Hết phòng" : ""}
                    </Text>
                  </View>
                  <Text className="text-violet-400 font-semibold">${room.pricePerNight}/đêm</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="text-neutral-400 text-sm mb-4">Chọn ngày check-in và check-out</Text>
        <DateRangePicker mode="range" start={start} end={end} onChange={(s, e) => { setStart(s); setEnd(e); }} />

        <View className="flex-row items-center justify-between bg-neutral-900 rounded-2xl p-4 mt-6">
          <View>
            <Text className="text-white font-semibold">Số phòng</Text>
            <Text className="text-neutral-500 text-xs mt-1">{nights > 0 ? `${nights} đêm` : "Chọn ngày trước"}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setRooms((r) => Math.max(1, r - 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="remove" size={16} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white w-6 text-center">{rooms}</Text>
            <TouchableOpacity onPress={() => setRooms((r) => Math.min(5, r + 1))} className="w-8 h-8 rounded-full bg-neutral-700 items-center justify-center">
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {nights > 0 && selectedRoom && (
          <View className="mt-6">
            <PricingSummary
              rows={[
                { label: `$${price} × ${nights} đêm × ${rooms} phòng`, value: `$${subtotal}` },
                { label: "Phí dịch vụ", value: `$${serviceFee}` },
                { label: "Thuế (10%)", value: `$${tax}` },
              ]}
              total={`$${total}`}
            />
          </View>
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