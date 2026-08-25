import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    destinationId: string;
    destinationName: string;
    tourCount: number;
    hotelCount: number;
}

const DestinationBottomBar = ({destinationId, destinationName, tourCount, hotelCount} : Props) => {
    const router = useRouter();
    return (
        <View className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] px-6 py-5 border-neutral-700">
            <View className="flex-row justify-between items-center ">
                <View className="flex-1 mr-4">
                    <Text className="text-neutral-400">Có tại {destinationName}</Text>
                    <Text className="text-white text-lg font-bold" numberOfLines={1}>
                        {tourCount} tour · {hotelCount} khách sạn
                    </Text>
                </View>
                <TouchableOpacity
                    className="bg-violet-600 px-6 py-4 rounded-2xl"
                    disabled={tourCount === 0}
                    style={tourCount === 0 ? { opacity: 0.5 } : undefined}
                    onPress={() =>
                        router.push({
                        pathname: "/search",
                        params: { destinationId, destinationName, tab: "tours" },
                        })
                    }
                >
                    <Text className="text-white font-bold text-lg">
                        {tourCount > 0 ? "Xem tour" : "Chưa có tour"}
                    </Text>
                </TouchableOpacity>
            </View> 
        </View>
    )
}

export default DestinationBottomBar;