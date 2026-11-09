import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import type { PaymentSimulationOutcome } from "@/src/services/paymentService";

type Props = {
  outcome: PaymentSimulationOutcome;
  onChangeOutcome: (outcome: PaymentSimulationOutcome) => void;
};

const OUTCOMES: {
  key: PaymentSimulationOutcome;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  {
    key: "success",
    label: "Thành công",
    description: "Giao dịch được xác nhận",
    icon: "checkmark-circle-outline",
    color: "#34d399",
  },
  {
    key: "failure",
    label: "Thất bại",
    description: "Giao dịch bị từ chối",
    icon: "close-circle-outline",
    color: "#f87171",
  },
  {
    key: "cancel",
    label: "Huỷ",
    description: "Người dùng huỷ thanh toán",
    icon: "arrow-undo-circle-outline",
    color: "#fbbf24",
  },
];

export default function PaymentSimulationPanel({ outcome, onChangeOutcome }: Props) {
  return (
    <View className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
      <View className="flex-row items-center">
        <Ionicons name="flask-outline" size={18} color="#fbbf24" />
        <Text className="ml-2 text-amber-200 font-semibold">Mô phỏng thanh toán · Dev</Text>
      </View>
      <Text className="mt-1 text-xs leading-5 text-neutral-400">
        Không kết nối cổng tiền thật. Luồng: tạo booking → tạo giao dịch pending → gọi API confirm hoặc fail.
      </Text>
      <View className="mt-3 gap-2">
        {OUTCOMES.map((item) => {
          const selected = outcome === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onChangeOutcome(item.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                selected ? "border-amber-300/50 bg-amber-300/10" : "border-neutral-800 bg-neutral-900/60"
              }`}
            >
              <Ionicons name={item.icon} size={20} color={item.color} />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-white">{item.label}</Text>
                <Text className="mt-0.5 text-xs text-neutral-500">{item.description}</Text>
              </View>
              <Ionicons
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={18}
                color={selected ? "#fbbf24" : "#737373"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
