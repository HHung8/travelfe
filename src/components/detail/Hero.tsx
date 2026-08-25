import { useAuth } from '@/src/context/AuthContext';
import { toggleWishList } from '@/src/services/wishlishService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

type WishlistItemType = "tour" | "hotel" | "destination";

type HeroProps = {
  image: string;
  rating?: number | null;
  reviews?: number | null;
  itemType?: WishlistItemType
  itemId?: string;
  initialWishlisted?:boolean
}; 

const Hero = ({ image, rating, reviews, itemType, itemId, initialWishlisted = false }: HeroProps) => {
  const router = useRouter();
  const { accessToken } = useAuth();
  
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const canWishlist = !!itemType && !!itemId;

  const handleToggleWishlist = async () => {
    if(!canWishlist || togglingWishlist) return;
    setTogglingWishlist(true);
    const prevState = isWishlisted;
    setIsWishlisted(!prevState);
    
    try {
      const res = await toggleWishList(accessToken, itemType!, itemId!);
      setIsWishlisted(res.data?.isWishlisted ?? !prevState);
    } catch (error) {
      console.log("error toggle wishlist", error);
      setIsWishlisted(prevState);
    } finally {
      setTogglingWishlist(false);
    }
  }


  return (
    <ImageBackground
      source={{ uri: image }}
      className="h-80 justify-between"
      imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
    >
      {/* Overlay */}
      <View className="absolute inset-0 bg-black/25 rounded-b-[30px]" />
      {/* Top Buttons */}
      <View className="flex-row justify-between px-6 pt-14">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-black/40 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        {canWishlist && (
          <TouchableOpacity
            onPress={handleToggleWishlist}
            disabled={togglingWishlist}
            className="w-11 h-11 rounded-full bg-black/40 items-center justify-center"
          >
              <Ionicons
                name={isWishlisted ? "heart" : "heart-outline"}
                size={24}
                color={isWishlisted ? "#ef4444" : "white"}
              />
          </TouchableOpacity>
        )}
      </View>

      {/* Rating */}
      <View className="px-6 pb-6">
        <View className="self-start bg-white rounded-full px-4 py-2 flex-row items-center">
          <Ionicons name="star" size={16}color="#FBBF24"/>
          <Text className="ml-2 font-semibold text-gray-800">
            {rating != null && reviews != null 
             ? `${rating} (${reviews} đánh giá)`
             : "Chưa có đánh giá"}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Hero
