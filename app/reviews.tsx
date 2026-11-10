import SafeImage from "@/src/components/detail/SafeImage";
import { useAuth } from "@/src/context/AuthContext";
import { deleteReview, getMyReviews } from "@/src/services/reviewService";
import { MyReviewItem } from "@/src/types/review";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import AppText from "@/src/components/common/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function ReviewsScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();
    const [reviews, setReviews] = useState<MyReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadReviews = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);  
        try {
            const data = await getMyReviews(accessToken);
            setReviews(data);
        } catch (error: any) {
            setError(error?.message || "Không tải được đánh giá");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken])

    useEffect(() => {
        loadReviews();
    }, [loadReviews])


    const handleDelete = (id: string) => {
        Alert.alert("Xoá đánh giá?", "Bạn không thể hoàn tác hành động này.", [
            { text: "Huỷ", style: "cancel" },
            {
                text: "Xoá",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteReview(accessToken, id);
                        setReviews((prev) => prev.filter((r) => r.id !== id));
                    } catch (error: any) {
                        Alert.alert("Lỗi", error?.message || "Không xoá được đánh giá")
                    }
                }
            }
        ])
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <AppText className="text-white text-lg font-semibold ml-2">Đánh giá của tôi</AppText>
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadReviews(true)} tintColor="#8B5CF6" />}
            >
                {error && <AppText className="text-red-400 mb-4">{error}</AppText>}

                {reviews.length === 0 && !error ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="star-outline" size={48} color="#525252" />
                        <AppText className="text-neutral-500 mt-4">Bạn chưa có đánh giá nào</AppText>
                    </View>
                ) : (
                    reviews.map((r) => (
                        <View key={r.id} className="bg-[#303030] rounded-2xl p-4 mb-4">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-700">
                                    <SafeImage uri={r.thumbnailUrl} className="w-full h-full" resizeMode="cover" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <AppText className="text-white font-bold text-base" numberOfLines={1}>{r.targetTitle}</AppText>
                                    <AppText className="text-neutral-500 text-xs">{fmtDate(r.createdAt)}</AppText>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(r.id)} className="p-2">
                                    <Ionicons name="trash-outline" size={18} color="#f87171" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row mt-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Ionicons key={i} name="star" size={14} color={i < r.rating ? "#facc15" : "#404040"} />
                                ))}
                            </View>

                            {!!r.comment && <AppText className="text-neutral-300 text-sm mt-2">{r.comment}</AppText>}
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    )
}