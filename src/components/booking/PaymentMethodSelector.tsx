import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { PaymentMethodItem } from "@/src/types/paymentMethod";

export type PaymentMethod = "card" | "apple_pay" | "wallet";

interface Props {
  method: PaymentMethod;
  onChangeMethod: (m: PaymentMethod) => void;
  cardNumber: string;
  onChangeCardNumber: (v: string) => void;
  expiry: string;
  onChangeExpiry: (v: string) => void;
  cvv: string;
  onChangeCvv: (v: string) => void;
  savedCards?: PaymentMethodItem[];
  selectedSavedCardId?: string | null;
  onChangeSavedCard?: (id: string | null) => void;
}

const METHODS: { key: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "card", label: "Thẻ ngân hàng", icon: "card-outline" },
  { key: "apple_pay", label: "Apple Pay", icon: "logo-apple" },
  { key: "wallet", label: "Ví điện tử", icon: "wallet-outline" },
];

const METHOD_DESCRIPTIONS: Record<PaymentMethod, string> = {
  card: "Visa, Mastercard và các loại thẻ khác",
  apple_pay: "Thanh toán nhanh trên thiết bị Apple",
  wallet: "Thanh toán bằng ví điện tử",
};

export default function PaymentMethodSelector({
  method, onChangeMethod, cardNumber, onChangeCardNumber, expiry, onChangeExpiry, cvv, onChangeCvv,
  savedCards, selectedSavedCardId, onChangeSavedCard,
}: Props) {
  return (
    <View>
      <Text className="text-white text-base font-semibold mb-3">Chọn phương thức thanh toán</Text>
      <View className="gap-3">
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.key}
            onPress={() => onChangeMethod(m.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: method === m.key }}
            className={`flex-row items-center rounded-2xl border p-4 ${
              method === m.key ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-800 bg-neutral-900/60"
            }`}
          >
            <View className={`w-11 h-11 rounded-xl items-center justify-center ${
              method === m.key ? "bg-indigo-500/20" : "bg-neutral-800"
            }`}>
              <Ionicons name={m.icon} size={21} color={method === m.key ? "#a5b4fc" : "#a3a3a3"} />
            </View>
            <View className="flex-1 ml-3">
              <Text className={`font-semibold ${method === m.key ? "text-indigo-200" : "text-white"}`}>{m.label}</Text>
              <Text className="text-neutral-500 text-xs mt-1">{METHOD_DESCRIPTIONS[m.key]}</Text>
            </View>
            <Ionicons
              name={method === m.key ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={method === m.key ? "#818cf8" : "#737373"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {method === "card" && (
        <View className="mt-4">
          {!!savedCards?.length && onChangeSavedCard && (
            <View className="mb-3 gap-2">
              <Text className="text-neutral-400 text-xs font-medium">Thẻ đã lưu</Text>
              {savedCards.map((card) => {
                const selected = selectedSavedCardId === card.id;
                return (
                  <TouchableOpacity
                    key={card.id}
                    onPress={() => onChangeSavedCard(card.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    className={`flex-row items-center rounded-xl border p-3 ${
                      selected ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-800 bg-neutral-900/60"
                    }`}
                  >
                    <Ionicons name="card-outline" size={20} color={selected ? "#a5b4fc" : "#a3a3a3"} />
                    <View className="ml-3 flex-1">
                      <Text className="text-white text-sm font-medium">{card.brand} ···· {card.last4}</Text>
                      <Text className="mt-0.5 text-neutral-500 text-xs">
                        Hết hạn {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
                        {card.isDefault ? " · Mặc định" : ""}
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? "radio-button-on" : "radio-button-off"}
                      size={18}
                      color={selected ? "#818cf8" : "#737373"}
                    />
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                onPress={() => onChangeSavedCard(null)}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedSavedCardId === null }}
                className={`flex-row items-center rounded-xl border p-3 ${
                  selectedSavedCardId === null ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-800 bg-neutral-900/60"
                }`}
              >
                <Ionicons name="add-circle-outline" size={20} color="#a5b4fc" />
                <Text className="ml-3 flex-1 text-white text-sm font-medium">Dùng thẻ demo khác</Text>
                <Ionicons
                  name={selectedSavedCardId === null ? "radio-button-on" : "radio-button-off"}
                  size={18}
                  color={selectedSavedCardId === null ? "#818cf8" : "#737373"}
                />
              </TouchableOpacity>
            </View>
          )}
          {(!savedCards?.length || selectedSavedCardId == null) && (
            <View className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-medium">Thông tin thẻ demo</Text>
                <View className="flex-row items-center">
                  <Ionicons name="flask-outline" size={13} color="#fbbf24" />
                  <Text className="text-amber-200 text-[10px] ml-1">Không dùng thẻ thật</Text>
                </View>
              </View>
              <Text className="text-neutral-500 text-xs leading-5 mb-3">
                Ví dụ demo: 4242 4242 4242 4242 · 12/30 · CVV 123. Chỉ kiểm tra giao diện, không gửi số thẻ/CVV lên backend.
              </Text>
              <View>
                <Text className="text-neutral-400 text-xs mb-1.5">Số thẻ giả lập</Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={(v) => onChangeCardNumber(v.replace(/[^0-9]/g, "").slice(0, 16))}
                  placeholder="•••• •••• •••• ••••"
                  placeholderTextColor="#525252"
                  keyboardType="number-pad"
                  className="bg-[#1a1a1a] border border-neutral-800 text-white rounded-xl px-4 py-3.5"
                />
              </View>
              <View className="flex-row gap-3 mt-3">
                <View className="flex-1">
                  <Text className="text-neutral-400 text-xs mb-1.5">Ngày hết hạn</Text>
                  <TextInput
                    value={expiry}
                    onChangeText={(v) => {
                      const c = v.replace(/[^0-9]/g, "").slice(0, 4);
                      onChangeExpiry(c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2)}` : c);
                    }}
                    placeholder="MM/YY"
                    placeholderTextColor="#525252"
                    keyboardType="number-pad"
                    className="bg-[#1a1a1a] border border-neutral-800 text-white rounded-xl px-4 py-3.5"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-neutral-400 text-xs mb-1.5">CVV demo</Text>
                  <TextInput
                    value={cvv}
                    onChangeText={(v) => onChangeCvv(v.replace(/[^0-9]/g, "").slice(0, 4))}
                    placeholder="•••"
                    placeholderTextColor="#525252"
                    secureTextEntry
                    keyboardType="number-pad"
                    className="bg-[#1a1a1a] border border-neutral-800 text-white rounded-xl px-4 py-3.5"
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      )}
      {method !== "card" && (
        <View className="mt-4 flex-row items-center rounded-2xl bg-neutral-900 px-4 py-3.5">
          <Ionicons name="information-circle-outline" size={19} color="#a5b4fc" />
          <Text className="flex-1 text-neutral-400 text-xs ml-2 leading-5">
            Bạn sẽ tiếp tục với {METHODS.find((item) => item.key === method)?.label}. Thông tin thẻ không cần thiết cho lựa chọn này.
          </Text>
        </View>
      )}
    </View>
  );
}