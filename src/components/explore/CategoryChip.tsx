import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from "@/src/components/common/AppText";

type Props = {
    title: string;
    active?: boolean;
    onPress?: () => void;
}

const CategoryChip = ({ title, active, onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`px-5 py-3 rounded-full mr-3 border ${
                active ? "bg-[#37355D] border-[#37355D]" : "border-neutral-600"
            }`}
        >
            <AppText className={`font-semibold ${active ? "text-white" : "text-neutral-300"}`}>{title}</AppText>
        </TouchableOpacity>
    )
}

export default CategoryChip