import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import SafeImage from "../detail/SafeImage";

type Props = {
    title: string;
    subtitle: string;
    thumbnailUrl: string | null;
    price: string;
    rating: number | null;
    onPress?: () => void;
}

const WishlistCard = ({ title, subtitle, thumbnailUrl, price, rating, onPress } : Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-[#303030] rounded-2xl p-3 mb-4 flex-row items-center"
        >
            <View className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-700">
                <SafeImage uri={thumbnailUrl} className="w-full h-full" resizeMode="cover" />
            </View>

            <View className="flex-1 ml-3">
                <Text className="text-white font-bold text-base" numberOfLines={1}>{title}</Text>
                <Text className="text-neutral-400 text-xs mt-1" numberOfLines={1}>{subtitle}</Text>
                <View className="flex-row items-center mt-1">
                    {rating != null && (
                        <>
                            <Ionicons name="star" size={12} color="#facc15" />
                            <Text className="text-neutral-400 text-xs ml-1 mr-2">{rating}</Text>
                        </>
                    )}
                    <Text className="text-violet-500 font-bold text-sm">{price}</Text>
                </View>
            </View>

            <Ionicons name="heart" size={20} color="#ef4444" />
        </TouchableOpacity>
    )
}

export default WishlistCard;