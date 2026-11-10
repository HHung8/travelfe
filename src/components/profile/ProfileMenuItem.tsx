import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";


type Props = {
    title: string;
    icon: any;
    onPress: () => void;
}

const ProfileMenuItem = ({ title, icon, onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-[#333333] border border-neutral-600 rounded-2xl px-5 py-5 mb-4 flex-row items-center justify-between"
        >
            <View className="flex-row items-center">

                <Ionicons
                    name={icon}
                    size={24}
                    color="#D1D5DB"
                />

                <AppText className="text-white text-xl font-semibold ml-4">
                    {title}
                </AppText>

            </View>

            <Ionicons
                name="chevron-forward"
                size={22}
                color="#BDBDBD"
            />
        </TouchableOpacity>
    )
}

export default ProfileMenuItem