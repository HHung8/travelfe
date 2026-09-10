import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { AttractionSchedule } from "../../types/attractionSchedule.ts";

const fmtDate= (iso:string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

type Props = {
    schedule: AttractionSchedule;
    basePrice: number;
    selected: boolean;
    onPress: () => void;
}

const AttractionScheduleCard = ({schedule, basePrice, selected, onPress}: Props) => {
    const isFull = schedule.availableSlots <= 0;
    const price = schedule.overridePrice ?? basePrice;
    
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isFull}
            className={`rounded-2xl p-4 mb-3 border ${
                isFull ? "border-neutral-800 opacity-50" : selected ? "border-indigo-500 bg-indigo-500/10" : "border-neutral-800 bg-neutral-900"
            }`}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color={selected ? "#818cf8" : "#a3a3a3"} />
                <Text className={`ml-2 font-semibold ${selected ? "text-indigo-400" : "text-white"}`}>
                    {fmtDate(schedule.visitDate)}
                </Text>
                </View>
                <Text className="text-violet-500 font-bold">${price}</Text>
            </View>
            <Text className={`text-xs mt-2 ${isFull ? "text-red-400" : "text-neutral-500"}`}>
                {isFull ? "Đã hết vé" : `Còn ${schedule.availableSlots} vé`}
            </Text>
        </TouchableOpacity>
    )
};

export default AttractionScheduleCard;