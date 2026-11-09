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
            setError(error?.message || "Không tải được phương thức thanh toán");
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
        Alert.alert("Xoá thẻ?", "Bạn không thể hoàn tác hành động này.", [
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

                {__DEV__ && (
                    <View className="flex-row rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 mb-5">
                        <Ionicons name="flask-outline" size={19} color="#fbbf24" />
                        <Text className="flex-1 text-xs leading-5 text-neutral-300 ml-3">
                            Môi trường dev: dùng dữ liệu thẻ giả lập, không nhập thẻ thật. Backend chỉ nhận hãng thẻ, 4 số cuối và ngày hết hạn; số thẻ đầy đủ không được lưu.
                        </Text>
                    </View>
                )}

                <View className="rounded-3xl bg-[#23223a] p-5 mb-7 border border-indigo-400/20">
                    <View className="flex-row items-center justify-between">
                        <View className="w-12 h-12 rounded-2xl bg-indigo-400/15 items-center justify-center">
                            <Ionicons name="shield-checkmark-outline" size={24} color="#a5b4fc" />
                        </View>
                        <View className="rounded-full bg-emerald-400/10 px-3 py-1">
                            <Text className="text-emerald-300 text-xs font-medium">Thanh toán an toàn</Text>
                        </View>
                    </View>
                    <Text className="text-white text-xl font-bold mt-4">Thanh toán theo cách của bạn</Text>
                    <Text className="text-neutral-400 text-sm mt-2 leading-5">
                        Quản lý thẻ đã lưu hoặc xem các phương thức thanh toán khác được hỗ trợ.
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-white text-base font-semibold">Thẻ đã lưu</Text>
                    <Text className="text-neutral-500 text-sm">{methods.length} thẻ</Text>
                </View>

                {methods.length === 0 ? (
                    <View className="rounded-2xl bg-[#242424] border border-neutral-800 items-center px-5 py-7 mb-3">
                        <View className="w-12 h-12 rounded-full bg-neutral-800 items-center justify-center">
                            <Ionicons name="card-outline" size={22} color="#a3a3a3" />
                        </View>
                        <Text className="text-white font-medium mt-3">Chưa có thẻ nào</Text>
                        <Text className="text-neutral-500 text-xs text-center mt-1">
                            Thêm thẻ để thuận tiện hơn cho lần thanh toán tiếp theo.
                        </Text>
                    </View>
                ) : (
                    methods.map((card) => (
                        <View
                            key={card.id}
                            className={`flex-row items-center rounded-2xl p-3 mb-3 border ${card.isDefault ? "bg-[#292842] border-indigo-500/70" : "bg-[#242424] border-neutral-800"
                                }`}
                        >
                            <TouchableOpacity
                                onPress={() => handleSetDefault(card.id)}
                                accessibilityRole="button"
                                accessibilityLabel={`Đặt ${card.brand} kết thúc bằng ${card.last4} làm mặc định`}
                                className="flex-1 flex-row items-center"
                            >
                                <View className="w-14 h-14 rounded-xl bg-indigo-500/15 items-center justify-center">
                                    <Ionicons name="card" size={24} color="#a5b4fc" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <View className="flex-row items-center">
                                        <Text className="text-white font-semibold">{card.brand}</Text>
                                        {card.isDefault && (
                                            <View className="bg-indigo-500/20 px-2 py-1 rounded-full ml-2">
                                                <Text className="text-indigo-300 text-[10px] font-semibold">MẶC ĐỊNH</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-neutral-300 text-sm mt-1">•••• •••• •••• {card.last4}</Text>
                                    <Text className="text-neutral-500 text-xs mt-1">
                                        Hết hạn {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
                                    </Text>
                                </View>
                                {!card.isDefault && (
                                    <Ionicons name="radio-button-off" size={20} color="#737373" />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(card.id)}
                                accessibilityRole="button"
                                accessibilityLabel={`Xoá thẻ ${card.brand} kết thúc bằng ${card.last4}`}
                                className="p-3 ml-1"
                            >
                                <Ionicons name="trash-outline" size={18} color="#f87171" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                <TouchableOpacity
                    onPress={() => setShowAddModal(true)}
                    className="flex-row items-center justify-center border border-dashed border-indigo-400/50 rounded-2xl p-4 mt-1 mb-8"
                >
                    <Ionicons name="add-circle-outline" size={20} color="#a5b4fc" />
                    <Text className="text-indigo-300 ml-2 font-semibold">Thêm thẻ mới</Text>
                </TouchableOpacity>

                <Text className="text-white text-base font-semibold mb-3">Phương thức khác</Text>
                <View className="rounded-2xl bg-[#242424] border border-neutral-800 p-4 mb-3">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-xl bg-neutral-800 items-center justify-center">
                            <Ionicons name="logo-apple" size={23} color="#fff" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-white font-semibold">Apple Pay</Text>
                            <Text className="text-neutral-500 text-xs mt-1">Thanh toán nhanh bằng thiết bị Apple</Text>
                        </View>
                        <View className="rounded-full bg-neutral-800 px-2.5 py-1">
                            <Text className="text-neutral-400 text-[10px] font-medium">Sắp ra mắt</Text>
                        </View>
                    </View>
                </View>
                <View className="rounded-2xl bg-[#242424] border border-neutral-800 p-4 mb-5">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-xl bg-neutral-800 items-center justify-center">
                            <Ionicons name="wallet-outline" size={23} color="#c4b5fd" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="text-white font-semibold">Ví điện tử</Text>
                            <Text className="text-neutral-500 text-xs mt-1">Kết nối ví điện tử của bạn</Text>
                        </View>
                        <View className="rounded-full bg-neutral-800 px-2.5 py-1">
                            <Text className="text-neutral-400 text-[10px] font-medium">Sắp ra mắt</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal visible={showAddModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-[#1a1a1a] rounded-t-3xl p-6">
                        <Text className="text-white text-lg font-bold mb-4">Thêm thẻ mới</Text>
                        {__DEV__ && (
                            <Text className="text-amber-200 text-xs leading-5 mb-4">
                                Chỉ nhập dữ liệu giả lập để thử luồng thêm thẻ. Không sử dụng thông tin thẻ thật.
                            </Text>
                        )}

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