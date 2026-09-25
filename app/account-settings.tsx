import { useAuth } from "@/src/context/AuthContext";
import { deleteAccount, getNotificationPreferences, setNotificationPreferences, updateProfile } from "@/src/services/accountService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSettingsScreen() {
    const router = useRouter();
    const { user, accessToken, logout, updateUser } = useAuth();

    const [name, setName] = useState(user?.fullName ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const email = user?.email ?? "";

    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [loadingPrefs, setLoadingPrefs] = useState(true);

    const [saving, setSaving] = useState(false);

    const loadPrefs = useCallback(async () => {
        setLoadingPrefs(true);
        try {
            const prefs = await getNotificationPreferences(accessToken);
            setPushEnabled(prefs.pushEnabled);
            setEmailEnabled(prefs.emailEnabled);
        } catch (err) {
            console.log("error loading notification preferences", err);
        } finally {
            setLoadingPrefs(false);
        }
    }, [accessToken]);

    useEffect(() => {
        loadPrefs();
    }, [loadPrefs])

    const handleTogglePush = async (value: boolean) => {
        setPushEnabled(value);
        try {
            await setNotificationPreferences(accessToken, { pushEnabled: value, emailEnabled })
        } catch (err: any) {
            setPushEnabled(!value);
            Alert.alert("Lỗi", err?.message || "Không lưu được cài đặt");
        }
    }
    const handleToggleEmail = async (value: boolean) => {
        setEmailEnabled(value);
        try {
            await setNotificationPreferences(accessToken, { pushEnabled, emailEnabled: value });
        } catch (err: any) {
            setEmailEnabled(!value);
            Alert.alert("Lỗi", err?.message || "Không lưu được cài đặt");
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
        const updated = await updateProfile(accessToken, { fullName: name, phone });
        await updateUser({ fullName: name, phone });
        Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân");
        } catch (err: any) {
            Alert.alert("Lỗi", err?.message || "Không lưu được thông tin");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Xoá tài khoản?",
            "Hành động này sẽ vô hiệu hoá tài khoản của bạn vĩnh viễn. Bạn chắc chắn muốn tiếp tục?",
            [
                { text: "Huỷ", style: "cancel" },
                {
                    text: "Xoá tài khoản",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAccount(accessToken);
                            await logout();
                            router.replace("/(auth)/login");
                        } catch (err: any) {
                            Alert.alert("Lỗi", err?.message || "Không xoá được tài khoản");
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Cài đặt tài khoản</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                <Text className="text-neutral-400 text-sm mb-3">Thông tin cá nhân</Text>
                <View className="gap-3 mb-3">
                    <View>
                        <Text className="text-neutral-500 text-xs mb-1">Họ tên</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#525252"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                    <View>
                        <Text className="text-neutral-500 text-xs mb-1">Số điện thoại</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholderTextColor="#525252"
                            keyboardType="phone-pad"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                    <View>
                        <Text className="text-neutral-500 text-xs mb-1">Email</Text>
                        <View className="bg-neutral-800 rounded-xl px-4 py-3 flex-row items-center justify-between opacity-60">
                            <Text className="text-neutral-400">{email}</Text>
                            <Ionicons name="lock-closed-outline" size={14} color="#666" />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    disabled={saving}
                    onPress={handleSaveProfile}
                    className="bg-white rounded-2xl py-4 items-center mb-6"
                >
                    <Text className="text-black font-semibold">{saving ? "Đang lưu..." : "Lưu thông tin"}</Text>
                </TouchableOpacity>

                <Text className="text-neutral-400 text-sm mb-3">Thông báo</Text>
                {loadingPrefs ? (
                    <ActivityIndicator color="#8B5CF6" style={{ marginBottom: 24 }} />
                ) : (
                    <View className="bg-[#303030] rounded-2xl mb-6">
                        <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-700">
                            <Text className="text-white">Thông báo đẩy (push)</Text>
                            <Switch value={pushEnabled} onValueChange={handleTogglePush} trackColor={{ false: "#525252", true: "#6366f1" }} />
                        </View>
                        <View className="flex-row items-center justify-between px-4 py-4">
                            <Text className="text-white">Thông báo qua Email</Text>
                            <Switch value={emailEnabled} onValueChange={handleToggleEmail} trackColor={{ false: "#525252", true: "#6366f1" }} />
                        </View>
                    </View>
                )}

                <Text className="text-neutral-400 text-sm mb-3">Bảo mật</Text>
                <TouchableOpacity
                    onPress={() => router.push("/change-password")}
                    className="flex-row items-center justify-between bg-[#303030] rounded-2xl px-4 py-4 mb-6"
                >
                    <Text className="text-white">Đổi mật khẩu</Text>
                    <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDeleteAccount} className="items-center py-3">
                    <Text className="text-red-500 font-medium">Xóa tài khoản</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}