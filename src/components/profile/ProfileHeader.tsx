import React from 'react'
import { View } from 'react-native';
import AppText from "@/src/components/common/AppText";type ProfileHeaderProps = {
    tripCount: number | null;
    reviewCount: number | null;
    wishlistCount: number | null;
};

const ProfileHeader = ({ tripCount, reviewCount, wishlistCount }: ProfileHeaderProps) => {
    return (
        <View className="bg-[#353554] rounded-b-[35px] items-center pt-10 pb-10">

            <View className="w-24 h-24 rounded-full bg-violet-500 items-center justify-center">
                <AppText className="text-white text-4xl font-bold">
                    HN
                </AppText>
            </View>

            <AppText className="text-white text-3xl font-bold mt-5">
                Hung Nguyen
            </AppText>

            <AppText className="text-neutral-300 text-base mt-2">
                hung@email.com
            </AppText>

            <View className="flex-row justify-around w-full mt-8">
                <View className="items-center">
                    <AppText className="text-white text-3xl font-bold">
                        {tripCount ?? "—"}
                    </AppText>
                    <AppText className="text-neutral-300">
                        Chuyến đi
                    </AppText>
                </View>

                <View className="items-center">
                    <AppText className="text-white text-3xl font-bold">
                        {reviewCount ?? "—"}
                    </AppText>
                    <AppText className="text-neutral-300">
                        Đánh giá
                    </AppText>
                </View>

                <View className="items-center">
                    <AppText className="text-white text-3xl font-bold">
                        {wishlistCount ?? "—"}
                    </AppText>
                    <AppText className="text-neutral-300">
                        Wishlist
                    </AppText>
                </View>

            </View>

        </View>
    )
}

export default ProfileHeader