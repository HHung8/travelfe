import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Block = ({className}:{className:string}) => (
    <View className={`bg-neutral-800 rounded-2xl ${className}`} />
);

const TourDetailSkeleton = () => {
    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={["left", "right"]}>
            <Block className="h-80 rounded-none" />
            <View className="px-6 mt-5 gap-3">
                <Block className="h-7 w-3/4" />
                <Block className="h-4 w-1/3" />
                <Block className="h-6 w-1/4 mt-2" />
                <View className="flex-row gap-2 mt-2">
                <Block className="h-8 w-20" />
                <Block className="h-8 w-24" />
                <Block className="h-8 w-20" />
                </View>
                <Block className="h-4 w-full mt-3" />
                <Block className="h-4 w-full" />
                <Block className="h-4 w-2/3" />
            </View>
        </SafeAreaView>
    );
};

export default TourDetailSkeleton;
