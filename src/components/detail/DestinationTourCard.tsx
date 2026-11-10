import { TourSimple } from '@/src/types/tour';
import { resolveImageUrl } from '@/src/utils/image';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";

type Props = {
  item: TourSimple;
  onPress?: () => void;
};
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500835556837-99ac94a94552";


const DestinationTourCard = ({ item, onPress }: Props) => {
  const hasDiscount = item.discountPrice != null && item.discountPrice < item.price;
  const finalPrice = hasDiscount ? item.discountPrice : item.price;
  const imageUri = resolveImageUrl(item.thumbnailUrl) ?? FALLBACK_IMAGE;

  return (
    <TouchableOpacity onPress={onPress} className="w-56 bg-[#2A2A2A] rounded-3xl overflow-hidden mr-4">
      <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", height: 128 }}
          resizeMode="cover"
          onError={(e) => console.log("DEST TOUR IMG ERR", imageUri, e.nativeEvent)}
      />
      
      <View className="p-4">
        <AppText className="text-white font-bold text-base" numberOfLines={1}>
          {item.title}
        </AppText>

        <View className="flex-row items-center mt-2">
          <Ionicons name="time-outline" size={13} color="#a3a3a3" />
          <AppText className="text-neutral-400 text-xs ml-1">{item.durationDays} ngày</AppText>
          {item.averageRating != null && (
            <>
              <AppText className="text-neutral-600 mx-2">·</AppText>
              <Ionicons name="star" size={13} color="#facc15" />
              <AppText className="text-neutral-400 text-xs ml-1">{item.averageRating}</AppText>
            </>
          )}
        </View>

        <View className="flex-row items-center mt-2">
          {hasDiscount && (
            <AppText className="text-neutral-500 text-xs line-through mr-2">${item.price}</AppText>
          )}
          <AppText className="text-violet-500 font-bold text-base">${finalPrice}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DestinationTourCard;