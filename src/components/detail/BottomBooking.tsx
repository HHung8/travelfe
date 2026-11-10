import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";

type Props = {
    price: number;
    tourId: string;
}

const BottomBooking = ({ price, tourId }: Props) => {
    const router = useRouter();
    return (
        <View className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] px-6 py-5 border-t border-neutral-700">
            <View className="flex-row justify-between items-center">
                <View>
                    <AppText className="text-neutral-400">
                        Giá từ
                    </AppText>
                    <AppText className="text-white text-3xl font-bold">
                        ${price}
                        <AppText className="text-base text-neutral-400">
                            {" "}/ người
                        </AppText>
                    </AppText>
                </View>

                <TouchableOpacity
                    className="bg-violet-600 px-8 py-4 rounded-2xl"
                    onPress={() => router.push({ pathname: "/booking-form", params: { tourId } })}
                >
                    <AppText className="text-white font-bold text-lg">Đặt ngay</AppText>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default BottomBooking