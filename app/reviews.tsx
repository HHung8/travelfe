import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const myReviews = [
    {id:"1", tourTitle: "Khám phá Vịnh Hạ Long", rating:5, comment: "Chuyến đi tuyệt vời, hướng dẫn viên nhiệt tình!", date: "15/6/2026"},
    {id: "2", tourTitle: "Phố cổ Hội An", rating: 4, comment: "Cảnh đẹp, đồ ăn ngon, chỉ hơi đông khách du lịch.", date: "2/5/2026" },
]

export default function ReviewsScreen() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Đánh giá của tôi</Text>
            </View>
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
            {myReviews.length === 0 ? (
            <View className="items-center justify-center mt-20">
                <Ionicons name="star-outline" size={48} color="#525252" />
                <Text className="text-neutral-500 mt-4">Bạn chưa có đánh giá nào</Text>
            </View>
            ) : (
            myReviews.map((r) => (
                <View key={r.id} className="bg-[#303030] rounded-2xl p-4 mb-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-white font-bold text-base flex-1" numberOfLines={1}>{r.tourTitle}</Text>
                    <Text className="text-neutral-500 text-xs">{r.date}</Text>
                </View>
                <View className="flex-row mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color={i < r.rating ? "#facc15" : "#404040"} />
                    ))}
                </View>
                <Text className="text-neutral-300 text-sm mt-2">{r.comment}</Text>
                </View>
            ))
            )}
        </ScrollView>
        </SafeAreaView>
    )
}