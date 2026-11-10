import { ExploreItem } from '@/src/types/explore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";

type Props = {
  // Define any props if needed
  item:ExploreItem;
  onPress?: () => void;
}   

const FALLBACK_IMAGE = "https://via.placeholder.com/400x200.png?text=No+Image";

const ExploreCard = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-[#323232] rounded-3xl overflow-hidden mb-5">
      <View className="h-32 justify-center items-center">
        <Image
          source={{ uri: item.thumbnailUrl ?? FALLBACK_IMAGE }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {item.rating != null && (
          <View className="absolute top-4 right-4 bg-white rounded-full px-3 py-1">
            <AppText className="font-semibold text-[#555]">⭐ {item.rating.toFixed(1)}</AppText>
          </View>
        )}
      </View>
      <View className="p-4">
        <AppText className="text-white text-xl font-bold">{item.title}</AppText>
        <View className="flex-row justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" color="#aaa" size={15} />
            <AppText className="text-neutral-400 ml-1">{item.subtitle}</AppText>
          </View>
          <AppText className="text-violet-500 font-bold">
            {item.price != null ? `$${item.price.toLocaleString()}` : "Liên hệ"}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ExploreCard