
import { Tour } from '@/src/types/tour';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  item: Tour;
  onPress?: () => void;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500835556837-99ac94a94552";

const TourCard = ({ item, onPress }: Props) => {
  const hasDiscount = item.discountPrice != null && item.discountPrice > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#303030] rounded-2xl p-4 mb-4 flex-row items-center"
    >
      <Image 
        source={{uri: item.thumbnailUrl || FALLBACK_IMAGE}}
        className="w-16 h-16 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4">
        <Text className="text-white font-bold text-lg" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-gray-500 text-xs" numberOfLines={1}>
          {item.destinationName}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-400">{item.durationDays} ngày </Text>
          <Text className="text-yellow-400 ml-2">
              ⭐ {item.averageRating != null ? item.averageRating.toFixed(1) : "Chưa có đánh giá"} 
          </Text>
        </View>
      </View>
      <View className='items-end'>
          {hasDiscount ? (
            <>
              <Text className='text-gray-500 text-xs line-through'>${item.price}</Text>
              <Text className='text-violet-500 font-bold text-xl' >${item.discountPrice}</Text>
            </>
          ) : (
              <Text className='text-violet-500 ' >${item.price}</Text>
          )}
      </View>
    </TouchableOpacity>
  );
};

export default TourCard;