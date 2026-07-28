import { Text, View } from "react-native";

interface Row {
  label: string;
  value: string;
}

interface Props {
  rows: Row[];
  totalLabel?: string;
  total: string;
}

export default function PricingSummary({ rows, totalLabel = "Tổng cộng", total }: Props) {
  return (
    <View className="gap-2">
      {rows.map((r, idx) => (
        <View key={idx} className="flex-row justify-between">
          <Text className="text-neutral-400">{r.label}</Text>
          <Text className="text-neutral-300">{r.value}</Text>
        </View>
      ))}
      <View className="flex-row justify-between border-t border-neutral-800 pt-2 mt-1">
        <Text className="text-white font-semibold">{totalLabel}</Text>
        <Text className="text-indigo-400 font-bold">{total}</Text>
      </View>
    </View>
  );
}