import { useAuth } from "@/src/context/AuthContext";
import { deleteAccount, getNotificationPreferences, setNotificationPreferences, updateProfile } from "@/src/services/accountService";
import { NotificationCategories, useAppSettings } from "@/src/context/AppSettingsContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native";
import AppTextInput from "@/src/components/common/AppTextInput";
import AppText from "@/src/components/common/AppText";
import { translateText } from "@/src/utils/translations";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSettingsScreen() {
    const router = useRouter();
    const { user, accessToken, logout, updateUser } = useAuth();
    const {
        language,
        currency,
        loadError,
        notificationCategories,
        setLanguage,
        setCurrency,
        setNotificationCategory,
    } = useAppSettings();

    const [name, setName] = useState(user?.fullName ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const email = user?.email ?? "";


    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [loadingPrefs, setLoadingPrefs] = useState(true);

    const [saving, setSaving] = useState(false);
    const [savingCategory, setSavingCategory] = useState<keyof NotificationCategories | null>(null);

    const showError = (message: string) => {
        Alert.alert(translateText("Lỗi", language), translateText(message, language));
    };

    const chooseLanguage = () => {
        Alert.alert(translateText("Chọn ngôn ngữ", language), undefined, [
            {
                text: translateText("Tiếng Việt", language),
                onPress: () => void setLanguage("vi").catch((err) => showError(err?.message || "Không lưu được cài đặt")),
            },
            {
                text: translateText("Tiếng Anh", language),
                onPress: () => void setLanguage("en").catch((err) => showError(err?.message || "Không lưu được cài đặt")),
            },
            { text: translateText("Đóng", language), style: "cancel" },
        ]);
    };

    const chooseCurrency = () => {
        Alert.alert(translateText("Chọn tiền tệ", language), undefined, [
            {
                text: translateText("Đồng Việt Nam (VND)", language),
                onPress: () =>
                    void setCurrency("VND").catch((err) =>
                        showError(err?.message || "Không lưu được cài đặt")
                    ),
            },
            {
                text: translateText("Đô la Mỹ (USD)", language),
                onPress: () =>
                    void setCurrency("USD").catch((err) =>
                        showError(err?.message || "Không lưu được cài đặt")
                    ),
            },
            { text: translateText("Đóng", language), style: "cancel" },
        ]);
    };

    const handleToggleCategory = async (
        category: keyof NotificationCategories,
        enabled: boolean
    ) => {
        setSavingCategory(category);
        try {
            await setNotificationCategory(category, enabled);
        } catch (err: any) {
            showError(err?.message || "Không lưu được cài đặt");
        } finally {
            setSavingCategory(null);
        }
    };

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
            showError(err?.message || "Không lưu được cài đặt");
        }
    }
    const handleToggleEmail = async (value: boolean) => {
        setEmailEnabled(value);
        try {
            await setNotificationPreferences(accessToken, { pushEnabled, emailEnabled: value });
        } catch (err: any) {
            setEmailEnabled(!value);
            showError(err?.message || "Không lưu được cài đặt");
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
        await updateProfile(accessToken, { fullName: name, phone });
        await updateUser({ fullName: name, phone });
        } catch (err: any) {
            showError(err?.message || "Không lưu được thông tin");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            translateText("Xoá tài khoản?", language),
            translateText("Hành động này sẽ vô hiệu hoá tài khoản của bạn vĩnh viễn. Bạn chắc chắn muốn tiếp tục?", language),
            [
                { text: translateText("Huỷ", language), style: "cancel" },
                {
                    text: translateText("Xoá tài khoản", language),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAccount(accessToken);
                            await logout();
                        } catch (err: any) {
                            showError(err?.message || "Không xoá được tài khoản");
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
                <AppText className="text-white text-lg font-semibold ml-2">Cài đặt tài khoản</AppText>
            </View>
            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                {loadError && (
                    <AppText className="text-red-400 text-sm mb-4">{loadError}</AppText>
                )}
                <AppText className="text-neutral-400 text-sm mb-3">Thông tin cá nhân</AppText>
                <View className="gap-3 mb-3">
                    <View>
                        <AppText className="text-neutral-500 text-xs mb-1">Họ tên</AppText>
                        <AppTextInput
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#525252"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                    <View>
                        <AppText className="text-neutral-500 text-xs mb-1">Số điện thoại</AppText>
                        <AppTextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholderTextColor="#525252"
                            keyboardType="phone-pad"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                    <View>
                        <AppText className="text-neutral-500 text-xs mb-1">Email</AppText>
                        <View className="bg-neutral-800 rounded-xl px-4 py-3 flex-row items-center justify-between opacity-60">
                            <AppText className="text-neutral-400">{email}</AppText>
                            <Ionicons name="lock-closed-outline" size={14} color="#666" />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    disabled={saving}
                    onPress={handleSaveProfile}
                    className="bg-white rounded-2xl py-4 items-center mb-6"
                >
                    <AppText className="text-black font-semibold">{saving ? "Đang lưu..." : "Lưu thông tin"}</AppText>
                </TouchableOpacity>

                <AppText className="text-neutral-400 text-sm mb-3">Thông báo</AppText>
                {loadingPrefs ? (
                    <ActivityIndicator color="#8B5CF6" style={{ marginBottom: 24 }} />
                ) : (
                    <View className="bg-[#303030] rounded-2xl mb-6">
                        <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-700">
                            <AppText className="text-white">Thông báo đẩy (push)</AppText>
                            <Switch value={pushEnabled} onValueChange={handleTogglePush} trackColor={{ false: "#525252", true: "#6366f1" }} />
                        </View>
                        <View className="flex-row items-center justify-between px-4 py-4">
                            <AppText className="text-white">Thông báo qua Email</AppText>
                            <Switch value={emailEnabled} onValueChange={handleToggleEmail} trackColor={{ false: "#525252", true: "#6366f1" }} />
                        </View>
                        <View className="border-t border-neutral-700 px-4 py-4">
                            <AppText className="text-neutral-400 text-xs mb-2">Chỉ lưu trên thiết bị này</AppText>
                            {([
                                ["bookingUpdates", "Cập nhật đặt chỗ và thanh toán"],
                                ["tripReminders", "Nhắc lịch khởi hành"],
                                ["promotions", "Ưu đãi và khuyến mãi"],
                            ] as const).map(([category, label]) => (
                                <View key={category} className="flex-row items-center justify-between py-3">
                                    <AppText className="text-white flex-1 mr-3">{label}</AppText>
                                    <Switch
                                        value={notificationCategories[category]}
                                        onValueChange={(value) => void handleToggleCategory(category, value)}
                                        disabled={savingCategory !== null}
                                        trackColor={{ false: "#525252", true: "#6366f1" }}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <AppText className="text-neutral-400 text-sm mb-3">Ngôn ngữ và tiền tệ</AppText>
                <View className="bg-[#303030] rounded-2xl mb-6">
                    <TouchableOpacity
                        onPress={chooseLanguage}
                        className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-700"
                    >
                        <AppText className="text-white">Ngôn ngữ</AppText>
                        <View className="flex-row items-center">
                            <AppText className="text-neutral-400 mr-2">
                                {language === "vi" ? "Tiếng Việt" : "Tiếng Anh"}
                            </AppText>
                            <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={chooseCurrency}
                        className="flex-row items-center justify-between px-4 py-4"
                    >
                        <AppText className="text-white">Tiền tệ</AppText>
                        <View className="flex-row items-center">
                            <AppText className="text-neutral-400 mr-2">{currency}</AppText>
                            <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
                        </View>
                    </TouchableOpacity>
                </View>

                <AppText className="text-neutral-400 text-sm mb-3">Bảo mật</AppText>
                <TouchableOpacity
                    onPress={() => router.push("/change-password")}
                    className="flex-row items-center justify-between bg-[#303030] rounded-2xl px-4 py-4 mb-6"
                >
                    <AppText className="text-white">Đổi mật khẩu</AppText>
                    <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDeleteAccount} className="items-center py-3">
                    <AppText className="text-red-500 font-medium">Xóa tài khoản</AppText>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}