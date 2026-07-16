import { Tour } from '@/src/types/home';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
interface Props {
  item: Tour;
}
const TourCard = ({ item }: Props) => {
  return (
    <TouchableOpacity className="bg-[#303030] rounded-2xl p-4 mb-4 flex-row items-center">

      <View className="w-16 h-16 rounded-xl bg-[#20254F] justify-center items-center">
        <Text className="text-4xl">
          {item.emoji}
        </Text>
      </View>

      <View className="flex-1 ml-4">

        <Text className="text-white font-bold text-lg">
          {item.title}
        </Text>

        <View className="flex-row items-center mt-1">

          <Text className="text-gray-400">
            {item.duration}
          </Text>

          <Text className="text-yellow-400 ml-2">
            ⭐ {item.rating}
          </Text>

        </View>
      </View>

      <Text className="text-violet-500 font-bold text-xl">
        ${item.price}
      </Text>

    </TouchableOpacity>
  );
}

export default TourCard