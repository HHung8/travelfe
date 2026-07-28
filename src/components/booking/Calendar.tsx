import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const days = [
    "",
    "",
    "1", "2", "3", "4", "5",
    "6", "7", "8", "9", "10", "11", "12",
    "13", "14", "15", "16", "17", "18", "19",
    "20", "21", "22", "23", "24", "25", "26",
    "27", "28", "29", "30", "31"
];

const Calendar = () => {
    return (
        <View className="mx-6 bg-[#3A3A3A] rounded-3xl p-5">
            <Text className="text-white text-2xl font-bold text-center">Tháng 7, 2025</Text>
            <View className="flex-row justify-between mt-6">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(item =>
                    <Text
                        key={item}
                        className="text-neutral-400 w-8 text-center"
                    >
                        {item}
                    </Text>
                )}
            </View>
            <View className="flex-row flex-wrap mt-5">
                {days.map((item, index) => {
                    const selected = item === "21" || item === "22";
                    return (
                        <TouchableOpacity
                            key={index}
                            className={`w-8 h-8 rounded-lg items-center justify-center m-1 ${selected
                                    ? "bg-[#6D5DF6]"
                                    : ""
                                }`}
                        >
                            <Text className="text-white">{item}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}
export default Calendar