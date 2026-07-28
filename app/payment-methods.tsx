import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const savedCards = [
  { id: "1", last4: "4242", brand: "Visa", expiry: "12/27", isDefault: true },
  { id: "2", last4: "8890", brand: "Mastercard", expiry: "09/26", isDefault: false },
];

export default function PaymentMethodsScreen() {
    const router = useRouter();
    const [defaultId, setDefaultId] = useState("1");
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Phương thức thanh toán</Text>
            </View>
            <ScrollView contentContainerStyle={{padding:24}} showsVerticalScrollIndicator={false}>
                {savedCards.map((card) => (
                    <TouchableOpacity
                        key={card.id}
                        onPress={() => setDefaultId(card.id)}
                        className={`flex-row items-center bg-[#303030] rounded-2xl p-4 mb-3 border ${
                            defaultId === card.id ? "border-indigo-500" : "border-transparent"
                        }`}
                    >
                        <View className="w-12 h-8 rounded-md bg-neutral-700 items-center justify-center">
                            <Ionicons name="card-outline" size={18} color="#fff" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-white font-semibold">{card.brand} •••• {card.last4}</Text>
                            <Text className="text-neutral-500 text-xs mt-1">Hết hạn {card.expiry}</Text>
                        </View>
                        {defaultId === card.id && (
                            <View className="bg-indigo-500/20 px-2 py-1 rounded-full">
                                <Text className="text-indigo-400 text-xs font-semibold">Mặc định</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
                <TouchableOpacity className="flex-row items-center justify-center border border-dashed border-neutral-600 rounded-2xl p-4 mt-2">
                    <Ionicons name="add" size={18} color="#a3a3a3" />
                    <Text className="text-neutral-300 ml-2 font-medium">Thêm thẻ mới</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}