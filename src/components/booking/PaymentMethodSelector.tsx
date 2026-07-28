import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

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
}

const METHODS: { key: PaymentMethod; label: string; icon: string }[] = [
  { key: "card", label: "Thẻ", icon: "card-outline" },
  { key: "apple_pay", label: "Apple Pay", icon: "logo-apple" },
  { key: "wallet", label: "Ví điện tử", icon: "wallet-outline" },
];

export default function PaymentMethodSelector({
  method, onChangeMethod, cardNumber, onChangeCardNumber, expiry, onChangeExpiry, cvv, onChangeCvv,
}: Props) {
  return (
    <View>
      <Text className="text-white font-semibold mb-3">Phương thức thanh toán</Text>
      <View className="flex-row gap-3">
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.key}
            onPress={() => onChangeMethod(m.key)}
            className={`flex-1 h-16 rounded-2xl items-center justify-center border ${
              method === m.key ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-800"
            }`}
          >
            <Ionicons name={m.icon as any} size={20} color={method === m.key ? "#818cf8" : "#a3a3a3"} />
            <Text className={`text-xs mt-1 ${method === m.key ? "text-indigo-400" : "text-neutral-400"}`}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {method === "card" && (
        <View className="mt-5 gap-3">
          <View>
            <Text className="text-neutral-500 text-xs mb-1">Số thẻ</Text>
            <TextInput
              value={cardNumber}
              onChangeText={(v) => onChangeCardNumber(v.replace(/[^0-9]/g, "").slice(0, 16))}
              placeholder="•••• •••• •••• ••••"
              placeholderTextColor="#525252"
              keyboardType="number-pad"
              className="bg-neutral-900 text-white rounded-xl px-4 py-3"
            />
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-neutral-500 text-xs mb-1">Hết hạn</Text>
              <TextInput
                value={expiry}
                onChangeText={(v) => {
                  const c = v.replace(/[^0-9]/g, "").slice(0, 4);
                  onChangeExpiry(c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2)}` : c);
                }}
                placeholder="MM/YY"
                placeholderTextColor="#525252"
                keyboardType="number-pad"
                className="bg-neutral-900 text-white rounded-xl px-4 py-3"
              />
            </View>
            <View className="flex-1">
              <Text className="text-neutral-500 text-xs mb-1">CVV</Text>
              <TextInput
                value={cvv}
                onChangeText={(v) => onChangeCvv(v.replace(/[^0-9]/g, "").slice(0, 4))}
                placeholder="•••"
                placeholderTextColor="#525252"
                secureTextEntry
                keyboardType="number-pad"
                className="bg-neutral-900 text-white rounded-xl px-4 py-3"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}