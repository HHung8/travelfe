import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import AppText from "@/src/components/common/AppText";
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
            activeOpacity={0.8}
            className="mb-3 min-h-[92px] flex-row items-center rounded-2xl border border-white/5 bg-[#242424] p-3"
        >
            <View className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-neutral-700">
                <SafeImage uri={thumbnailUrl} className="w-full h-full" resizeMode="cover" />
            </View>

            <View className="ml-3 min-w-0 flex-1 justify-center">
                <AppText className="text-base font-bold leading-5 text-white" numberOfLines={2}>{title}</AppText>
                {!!subtitle && (
                    <AppText className="mt-1 text-xs text-neutral-400" numberOfLines={1}>{subtitle}</AppText>
                )}
                <View className="mt-1.5 flex-row items-center">
                    {rating != null && (
                        <>
                            <Ionicons name="star" size={12} color="#facc15" />
                            <AppText className="ml-1 mr-2 text-xs text-neutral-400">{rating.toFixed(1)}</AppText>
                        </>
                    )}
                    <AppText className="shrink text-sm font-bold text-violet-400" numberOfLines={1}>{price}</AppText>
                </View>
            </View>

            <Ionicons name="heart" size={20} color="#ef4444" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
    )
}

export default WishlistCard;