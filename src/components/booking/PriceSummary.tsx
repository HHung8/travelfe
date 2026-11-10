import { View } from "react-native";
import AppText from "@/src/components/common/AppText";

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
          <AppText className="text-neutral-400">{r.label}</AppText>
          <AppText className="text-neutral-300">{r.value}</AppText>
        </View>
      ))}
      <View className="flex-row justify-between border-t border-neutral-800 pt-2 mt-1">
        <AppText className="text-white font-semibold">{totalLabel}</AppText>
        <AppText className="text-indigo-400 font-bold">{total}</AppText>
      </View>
    </View>
  );
}