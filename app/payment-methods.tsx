import { useAuth } from "@/src/context/AuthContext";
import { addPaymentMethod, deletePaymentMethod, getPaymentMethods, setDefaultPaymentMethod } from "@/src/services/paymentMethodService";
import { PaymentMethodItem } from "@/src/types/paymentMethod";
import { detectCardBrand } from "@/src/utils/cardBrand";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PaymentMethodsScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();

    const [methods, setMethods] = useState<PaymentMethodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadMethods = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPaymentMethods(accessToken);
            setMethods(data);
        } catch (error: any) {
            setError(error?.message || "Không tải được danh sách thẻ");
        } finally {
            setLoading(false);
        }
    }, [accessToken])

    useEffect(() => {
        loadMethods();
    }, [loadMethods])


    const handleSetDefault = async (id: string) => {
        setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
        try {
            await setDefaultPaymentMethod(accessToken, id);
        } catch (error: any) {
            Alert.alert("Lỗi", error?.message || "Không đặt được mặc định");
            loadMethods();
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert("Xoá thẻ?", "Bạn không thẻ hoàn tác hành động này", [
            { text: "Huỷ", style: "cancel" },
            {
                text: "Xoá",
                style: 'destructive',
                onPress: async () => {
                    const prev = methods;
                    setMethods((list) => list.filter((m) => m.id !== id));
                    try {
                        await deletePaymentMethod(accessToken, id);
                    } catch (error: any) {
                        setMethods(prev);
                        Alert.alert("Lỗi", error?.message || "Không xoá được thẻ");
                    }
                }
            }
        ])
    }

    const handleAddCard = async () => {
        const digits = cardNumber.replace(/\D/g, "");
        if (digits.length < 12) {
            Alert.alert("Số thẻ không hợp lệ", "Vui lòng nhập đủ số thẻ");
            return
        }
        const [monthStr, yearStr] = expiry.split("/");
        const month = Number(monthStr);
        const year = Number(`20${yearStr}`);
        if (!month || !year || month < 1 || month > 12) {
            Alert.alert("Ngày hết hạn không hợp lệ", "Định dạng MM/YY");
            return;
        }
        
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // getMonth() trả về 0-11
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            Alert.alert("Thẻ đã hết hạn", "Vui lòng kiểm tra lại ngày hết hạn của thẻ");
            return;
        }

        setSubmitting(true);
        try {
            await addPaymentMethod(accessToken, {
                brand: detectCardBrand(digits),
                last4: digits.slice(-4),
                expiryMonth: month,
                expiryYear: year,
            })
            setShowAddModal(false);
            setCardNumber("");
            setExpiry("");
            await loadMethods();
        } catch (error: any) {
            Alert.alert("Lỗi", error?.message || "Không thêm được thẻ")
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        );
    }
    
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Phương thức thanh toán</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                {error && <Text className="text-red-400 mb-4">{error}</Text>}

                {methods.map((card) => (
                    <TouchableOpacity
                        key={card.id}
                        onPress={() => handleSetDefault(card.id)}
                        onLongPress={() => handleDelete(card.id)}
                        className={`flex-row items-center bg-[#303030] rounded-2xl p-4 mb-3 border ${card.isDefault ? "border-indigo-500" : "border-transparent"
                            }`}
                    >
                        <View className="w-12 h-8 rounded-md bg-neutral-700 items-center justify-center">
                            <Ionicons name="card-outline" size={18} color="#fff" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-white font-semibold">{card.brand} •••• {card.last4}</Text>
                            <Text className="text-neutral-500 text-xs mt-1">
                                Hết hạn {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
                            </Text>
                        </View>
                        {card.isDefault && (
                            <View className="bg-indigo-500/20 px-2 py-1 rounded-full">
                                <Text className="text-indigo-400 text-xs font-semibold">Mặc định</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    onPress={() => setShowAddModal(true)}
                    className="flex-row items-center justify-center border border-dashed border-neutral-600 rounded-2xl p-4 mt-2"
                >
                    <Ionicons name="add" size={18} color="#a3a3a3" />
                    <Text className="text-neutral-300 ml-2 font-medium">Thêm thẻ mới</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showAddModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-[#1a1a1a] rounded-t-3xl p-6">
                        <Text className="text-white text-lg font-bold mb-4">Thêm thẻ mới</Text>

                        <Text className="text-neutral-500 text-xs mb-1">Số thẻ</Text>
                        <TextInput
                            value={cardNumber}
                            onChangeText={(v) => setCardNumber(v.replace(/[^0-9]/g, "").slice(0, 16))}
                            placeholder="•••• •••• •••• ••••"
                            placeholderTextColor="#525252"
                            keyboardType="number-pad"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3 mb-3"
                        />

                        <Text className="text-neutral-500 text-xs mb-1">Hết hạn (MM/YY)</Text>
                        <TextInput
                            value={expiry}
                            onChangeText={(v) => {
                                const c = v.replace(/[^0-9]/g, "").slice(0, 4);
                                setExpiry(c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2)}` : c);
                            }}
                            placeholder="MM/YY"
                            placeholderTextColor="#525252"
                            keyboardType="number-pad"
                            className="bg-neutral-900 text-white rounded-xl px-4 py-3 mb-6"
                        />

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowAddModal(false)}
                                className="flex-1 h-12 rounded-2xl border border-neutral-700 items-center justify-center"
                            >
                                <Text className="text-white font-medium">Huỷ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleAddCard}
                                disabled={submitting}
                                className="flex-1 h-12 rounded-2xl bg-white items-center justify-center"
                            >
                                {submitting ? <ActivityIndicator color="#000" /> : <Text className="text-black font-semibold">Thêm thẻ</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}