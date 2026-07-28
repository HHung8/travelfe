import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const notifications = [
  { id: "1", icon: "checkmark-circle-outline", title: "Đặt tour thành công", message: "Vịnh Hạ Long 3N2Đ đã được xác nhận.", time: "2 giờ trước", unread: true },
  { id: "2", icon: "pricetag-outline", title: "Ưu đãi mới", message: "Giảm 20% cho tour Sa Pa trong tuần này.", time: "1 ngày trước", unread: true },
  { id: "3", icon: "card-outline", title: "Thanh toán thành công", message: "Vinpearl Nha Trang - $255.", time: "3 ngày trước", unread: false },
]

export default function NotificationsScreen() {
    const router = useRouter();
    return (
       <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Thông báo</Text>              
            </View> 
            <ScrollView contentContainerStyle={{padding:24}} showsVerticalScrollIndicator={false}>
                {notifications.map((n) => (
                    <View key={n.id} className="flex-row bg-[#303030] rounded-2xl p-4 mb-3 items-start">
                         <View className="w-10 h-10 rounded-full bg-neutral-700 items-center justify-center">
                                <Ionicons name={n.icon as any} size={18} color="#fff"/>
                         </View>
                         <View className="flex-1 ml-3">
                                <Text className="text-white font-semibold text-sm">{n.title}</Text>
                                <Text className="text-neutral-400 text-sm mt-1" >{n.message}</Text>
                                <Text className="text-neutral-500 text-xs mt-1">{n.time}</Text>
                         </View>
                           {n.unread && <View className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />}
                    </View>
                ))}
            </ScrollView>
       </SafeAreaView> 
    )
}