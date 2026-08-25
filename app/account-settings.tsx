import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSettingsScreen() {
    const router = useRouter();
    const {user} = useAuth();
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Cài đặt tài khoản</Text>
            </View>
            <ScrollView contentContainerStyle={{padding:24}} showsVerticalScrollIndicator={false}>
                <Text className="text-neutral-400 text-sm mb-3">Thông tin cá nhân</Text>
                <View className="gap-3 mb-6">
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
                        <Text className="text-neutral-500 text-xs mb-1">Email</Text>
                        <TextInput 
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="#525252"
                            keyboardType="email-address"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3"
                        />
                    </View>
                </View>
                <Text className="text-neutral-400 text-sm mb-3">Thông báo</Text>
                <View className="bg-[#303030] rounded-2xl mb-6">
                    <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-700">
                        <Text className="text-white">Thông báo đẩy (push)</Text>
                        <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: "#525252", true: "#6366f1" }} />
                    </View>
                    <View className="flex-row items-center justify-between px-4 py-4">
                        <Text className="text-white">Thông báo qua Email</Text>
                        <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ false: "#525252", true: "#6366f1" }} />
                    </View>
                </View>
                <TouchableOpacity className="bg-white rounded-2xl py-4 items-center mb-3">
                    <Text className="text-black font-semibold">Lưu thay đổi</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center py-3">
                    <Text className="text-red-500 font-medium">Xóa tài khoản</Text>
                </TouchableOpacity>
                </ScrollView>
        </SafeAreaView>
    );
}