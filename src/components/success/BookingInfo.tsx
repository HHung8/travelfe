import React from 'react';
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";

const BookingInfo = () => {
    return (
        <View className="mt-8">

            <View className="bg-[#444] rounded-xl p-4">

                <AppText className="text-neutral-400 text-center">
                    Mã booking
                </AppText>
                <AppText className="text-[#6D5DF6] text-center font-bold text-xl mt-1">
                    TRV-20250720-0042
                </AppText>
            </View>

            <View className="mt-6">
                <Row
                    left="Tour"
                    right="Hạ Long 3N2Đ"
                />

                <Row
                    left="Ngày đi"
                    right="20 - 23/7/2025"
                />

                <Row
                    left="Số khách"
                    right="2 người"
                />

                <Row
                    left="Thanh toán"
                    right="$344  Thành công"
                    success
                />

            </View>

        </View>

    );

}

function Row({
    left,
    right,
    success
}: any) {

    return (

        <View className="flex-row justify-between py-3 border-b border-[#555]">

            <AppText className="text-neutral-400">
                {left}
            </AppText>

            <AppText
                className={`font-semibold ${success
                        ? "text-[#6DA544]"
                        : "text-white"
                    }`}
            >
                {right}
            </AppText>

        </View>
    )
}

export default BookingInfo