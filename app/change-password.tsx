import { useAuth } from "@/src/context/AuthContext";
import { changePassword } from "@/src/services/accountService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import AppTextInput from "@/src/components/common/AppTextInput";
import AppText from "@/src/components/common/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = currentPassword.length > 0 && newPassword.length >= 6 && newPassword === confirmPassword;

    const handleSubmit = async () => {
        if (!canSubmit) {
            if (newPassword !== confirmPassword) {
                Alert.alert("Lỗi", "Mật khẩu mới không khớp");
            }
            return;
        }
        setSubmitting(true);
        try {
            await changePassword(accessToken, { currentPassword, newPassword });
            router.back();
        } catch (err: any) {
            Alert.alert("Lỗi", err?.message || "Không đổi được mật khẩu");
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
                <AppText className="text-white text-lg font-semibold ml-2">Đổi mật khẩu</AppText>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                <View className="gap-3">
                    <View>
                        <AppText className="text-neutral-500 text-xs mb-1">Mật khẩu hiện tại</AppText>
                        <AppTextInput
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            placeholderTextColor="#525252"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                    <View>
                        <AppText className="text-neutral-500 text-xs mb-1">Mật khẩu mới</AppText>
                        <AppTextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            placeholderTextColor="#525252"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                    <View>
                        <AppText className="text-neutral-500 text-xs mb-1">Xác nhận mật khẩu mới</AppText>
                        <AppTextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor="#525252"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    disabled={!canSubmit || submitting}
                    onPress={handleSubmit}
                    className={`rounded-2xl py-4 items-center mt-6 ${canSubmit ? "bg-white" : "bg-neutral-700"}`}
                >
                    <AppText className={`font-semibold ${canSubmit ? "text-black" : "text-neutral-400"}`}>
                        {submitting ? "Đang lưu..." : "Đổi mật khẩu"}
                    </AppText>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}