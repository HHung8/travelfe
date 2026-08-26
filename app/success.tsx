import { useAuth } from "@/src/context/AuthContext";
import { getTourById } from "@/src/services/tourService";
import { TourDetail } from "@/src/types/tour";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, BackHandler, ScrollView, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";


const fmt = (iso: string) => { 
  const d = new Date(iso); 
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
};
const PUBLIC_BASE_URL = "https://your-public-domain.com/api"; 
export default function SuccessScreen() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { tourId, bookingId, bookingCode, travelDate, guests, total } = useLocalSearchParams<{
    tourId: string; bookingId: string; bookingCode: string; travelDate: string; guests: string; total: string; paymentStatus: string;
  }>();

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const qrShotRef = useRef<ViewShot>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (!tourId) return;
    fetchTour();
  }, [tourId]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4, 
      tension: 60, 
      useNativeDriver:true,
    }).start();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      router.replace("/home");
      return true;
    }
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, []);

  const fetchTour = async () => {
    setLoading(true);
    try {
      const data = await getTourById(accessToken, tourId);
      setTour(data);
    } catch (err) {
      console.log("error fetching tour on success screen", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareQr = async () => {
    try {
      const uri = await qrShotRef.current?.capture?.();
      if(!uri) return;
      const canShare = await Sharing.isAvailableAsync();
      if(canShare) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.log("share QR error", error);
    }
  }
  

  const handleSaveQr = async () => {
    try {
      setSaving(true);
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if(status !== "granted") {
        console.log("Chưa cấp quyền lưu ảnh");
        return;
      }
      const uri = await qrShotRef.current?.capture?.();
      if(!uri) return;
      await MediaLibrary.saveToLibraryAsync(uri);
    } catch (error) {
      console.log("save QR error", error);
    } finally {
      setSaving(false);
    }
  }

  const qrValue = `${PUBLIC_BASE_URL}/bookings/verify/${bookingId}`;

  return (
    <SafeAreaView className="flex-1 bg-[#121212] px-6">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >

        <Animated.View 
            style={{transform: [{scale: scaleAnim}]}}
            className="w-28 h-28 rounded-full bg-green-500/15 items-center justify-center mb-8"
        >
          <Ionicons name="checkmark" size={56} color="#22c55e" />
        </Animated.View>

        <Text className="text-white text-3xl font-bold">Đặt tour thành công!</Text>

        <View className="flex-row items-center bg-yellow-500/15 px-4 py-1.5 rounded-full mt-3">
          <View className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
          <Text className="text-yellow-400 text-sm font-medium">Chờ xác nhận thanh toán</Text>
        </View>

        {/* QR code */}
        <ViewShot ref={qrShotRef} options={{ format: "png", quality: 1 }}>
          <View className="bg-white rounded-3xl p-6 mt-8">
            <QRCode value={qrValue} size={220} backgroundColor="white" color="black" />
          </View>
        </ViewShot>
        <Text className="text-neutral-500 text-sm mt-4 text-center">
          Xuất trình mã khi tham gia tour
        </Text>

         {/* Nút chia sẻ / lưu QR */}
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            onPress={handleShareQr}
            className="flex-row items-center bg-neutral-900 px-4 py-2.5 rounded-xl"
          >
            <Ionicons name="share-outline" size={18} color="white" />
            <Text className="text-white text-sm ml-2">Chia sẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveQr}
            disabled={saving}
            className="flex-row items-center bg-neutral-900 px-4 py-2.5 rounded-xl"
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="download-outline" size={18} color="white" />
                <Text className="text-white text-sm ml-2">Lưu ảnh</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
    

       <View className="w-full bg-neutral-900 rounded-3xl p-6 mt-8">
          <Text className="text-neutral-400 text-sm text-center mb-2">Mã booking</Text>
          <Text className="text-indigo-400 font-bold text-center text-xl mb-6">{bookingCode}</Text>
          <View className="gap-4">
            <View className="flex-row justify-between">
              <Text className="text-neutral-500 text-base">Tour</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#8B5CF6" />
              ) : (
                <Text className="text-white text-base">{tour?.title ?? "—"}</Text>
              )}
            </View>
            <View className="flex-row justify-between">
              <Text className="text-neutral-500 text-base">Ngày khởi hành</Text>
              <Text className="text-white text-base">{fmt(travelDate)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-neutral-500 text-base">Số khách</Text>
              <Text className="text-white text-base">{guests} người</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-neutral-500 text-base">Tổng tiền</Text>
              <Text className="text-white text-base font-semibold">${total}</Text>
            </View>
          </View>
        </View>
            
        {/* Thông tin hỗ trợ */}
         <TouchableOpacity className="flex-row items-center mt-6">
          <Ionicons name="help-circle-outline" size={18} color="#737373" />
          <Text className="text-neutral-500 text-sm ml-1.5">Cần hỗ trợ? Liên hệ với chúng tôi</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="pb-8 gap-3">
        <TouchableOpacity onPress={() => router.push("/booking")} className="h-16 rounded-2xl bg-white items-center justify-center">
          <Text className="text-black font-semibold text-base">Xem booking của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/home")} className="h-16 rounded-2xl border border-neutral-700 items-center justify-center">
          <Text className="text-white font-semibold text-base">Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}