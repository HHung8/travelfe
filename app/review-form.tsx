import { useAuth } from "@/src/context/AuthContext";
import { createReview } from "@/src/services/reviewService";
import { ReviewTargetType } from "@/src/types/review";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewFormScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();
    const { targetType, targetId, targetTitle } = useLocalSearchParams<{
        targetType: ReviewTargetType; targetId: string, targetTitle: string;
    }>();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert("Thiếu đánh giá", "Vui lòng chọn số nào");
            return;
        }
        setSubmitting(true);
        try {
            await createReview(accessToken, {
                targetType,
                targetId,
                rating,
                comment: comment.trim() || undefined,
            });
            Alert.alert("Cảm ơn bạn!", "Đánh giá đã được gửi.", [
                { text: "OK", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert("Lỗi", error?.message || "Không gửi được đánh giá");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Viết đánh giá</Text>
            </View>

            <View className="px-6 mt-6">
                <Text className="text-white text-xl font-bold" numberOfLines={2}>{targetTitle}</Text>

                <Text className="text-neutral-400 text-sm mt-6 mb-3">Bạn đánh giá thế nào?</Text>
                <View className="flex-row justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                            <Ionicons
                                name={star <= rating ? "star" : "star-outline"}
                                size={40}
                                color={star <= rating ? "#facc15" : "#525252"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-neutral-400 text-sm mt-8 mb-2">Nhận xét (không bắt buộc)</Text>
                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    placeholderTextColor="#525252"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="bg-neutral-900 text-white rounded-xl px-4 py-3 min-h-[120px]"
                />
            </View>

            <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-[#121212] border-t border-neutral-900">
                <TouchableOpacity
                    disabled={submitting}
                    onPress={handleSubmit}
                    className={`h-14 rounded-2xl items-center justify-center ${submitting ? "bg-neutral-700" : "bg-white"}`}
                >
                    <Text className={`font-semibold text-base ${submitting ? "text-neutral-400" : "text-black"}`}>
                        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}