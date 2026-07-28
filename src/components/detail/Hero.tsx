import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

type HeroProps = {
  image: string;
  rating: number;
  reviews: number;
};


const Hero = ({ image, rating, reviews }: HeroProps) => {
  const router = useRouter();
  return (
    <ImageBackground
      source={{ uri: image }}
      className="h-80 justify-between"
      imageStyle={{
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
      }}
    >
      {/* Overlay */}
      <View className="absolute inset-0 bg-black/25 rounded-b-[30px]" />

      {/* Top Buttons */}
      <View className="flex-row justify-between px-6 pt-14">

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-black/40 items-center justify-center"
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-black/40 items-center justify-center"
        >
          <Ionicons
            name="heart-outline"
            size={24}
            color="white"
          />
        </TouchableOpacity>

      </View>

      {/* Rating */}
      <View className="px-6 pb-6">

        <View className="self-start bg-white rounded-full px-4 py-2 flex-row items-center">

          <Ionicons
            name="star"
            size={16}
            color="#FBBF24"
          />

          <Text className="ml-2 font-semibold text-gray-800">
            {rating} ({reviews} đánh giá)
          </Text>

        </View>

      </View>

    </ImageBackground>
  )
}

export default Hero
