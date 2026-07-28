import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const isBetween = (d: Date, s: Date, e: Date) => d.getTime() > s.getTime() && d.getTime() < e.getTime();

function buildMonthGrid(month: Date) {
  const year = month.getFullYear(), m = month.getMonth();
  const startOffset = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface Props {
  mode?: "range" | "single";
  start: Date | null;
  end: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

export default function DateRangePicker({ mode = "range", start, end, onChange }: Props) {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const cells = useMemo(() => buildMonthGrid(month), [month]);

  const handleSelectDay = (day: Date) => {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (day < startOfToday) return;

    if (mode === "single") {
      onChange(day, day);
      return;
    }
    if (!start || (start && end)) onChange(day, null);
    else if (day < start) onChange(day, null);
    else onChange(start, day);
  };

  return (
    <View>
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-base">
          {MONTH_NAMES[month.getMonth()]}, {month.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-2">
        {WEEKDAYS.map((w) => (
          <View key={w} className="flex-1 items-center">
            <Text className="text-neutral-500 text-xs">{w}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((day, idx) => {
          if (!day) return <View key={idx} style={{ width: "14.28%" }} className="h-11" />;
          const isStart = start && sameDay(day, start);
          const isEnd = end && sameDay(day, end);
          const inRange = mode === "range" && start && end && isBetween(day, start, end);
          const isPast = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <View key={idx} style={{ width: "14.28%" }} className="h-11 items-center justify-center">
              <Pressable
                disabled={isPast}
                onPress={() => handleSelectDay(day)}
                className={`w-9 h-9 items-center justify-center rounded-full ${
                  isStart || isEnd ? "bg-indigo-500" : inRange ? "bg-indigo-500/30" : ""
                }`}
              >
                <Text className={`${isPast ? "text-neutral-600" : isStart || isEnd ? "text-white font-semibold" : "text-neutral-200"} text-sm`}>
                  {day.getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}