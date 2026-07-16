import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  // Define any props if needed
  item:any;
}   

const ExploreCard = ({ item }: Props) => {
  return (
    <View className="bg-[#323232] rounded-3xl overflow-hidden mb-5">

      <View
        style={{
          backgroundColor: item.color,
        }}
        className="h-32 justify-center items-center"
      >
        <Text className="text-5xl">
          {item.emoji}
        </Text>

        <View className="absolute top-4 right-4 bg-white rounded-full px-3 py-1">
          <Text className="font-semibold text-[#555]">
            {item.rating}
          </Text>
        </View>
      </View>

      <View className="p-4">

        <Text className="text-white text-xl font-bold">
          {item.title}
        </Text>

        <View className="flex-row justify-between mt-2">

          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              color="#aaa"
              size={15}
            />

            <Text className="text-neutral-400 ml-1">
              {item.location}
            </Text>
          </View>

          <Text className="text-violet-500 font-bold">
            {item.price}
          </Text>

        </View>

      </View>

    </View>
  );
}

export default ExploreCard