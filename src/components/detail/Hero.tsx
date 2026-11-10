import { useAuth } from '@/src/context/AuthContext';
import {
  getCachedWishlistStatus, getDestinationWishlistStatus, getTourWishlistStatus, setCachedWishlistStatus, toggleWishList, } from '@/src/services/wishlishService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from "@/src/components/common/AppText";

type WishlistItemType = "tour" | "hotel" | "destination" | "attraction";

type HeroProps = {
  image?: string | null;
  rating?: number | null;
  reviews?: number | null;
  itemType?: WishlistItemType;
  itemId?: string;
  initialWishlisted?: boolean;
};

const Hero = ({ image, rating, reviews, itemType, itemId, initialWishlisted = false }: HeroProps) => {
   console.log("HERO render, image =", image);
  const router = useRouter();
  const { accessToken } = useAuth();

  const [isWishlisted, setIsWishlisted] = useState(() =>
    itemType && itemId
      ? getCachedWishlistStatus(accessToken, itemType, itemId) ?? initialWishlisted
      : initialWishlisted
  );
  const [loadingWishlistStatus, setLoadingWishlistStatus] = useState(
    (itemType === 'tour' || itemType === 'destination') &&
      !!itemId &&
      getCachedWishlistStatus(accessToken, itemType, itemId) === undefined
  );
  const [wishlistStatusError, setWishlistStatusError] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const canWishlist = !!itemType && !!itemId;

  useEffect(() => {
    if (!canWishlist || !itemType || !itemId) return;

    const cachedStatus = getCachedWishlistStatus(accessToken, itemType, itemId);
    setIsWishlisted(cachedStatus ?? initialWishlisted);

    if (cachedStatus !== undefined || (itemType !== 'tour' && itemType !== 'destination')) return;

    let active = true;
    setLoadingWishlistStatus(true);
    setWishlistStatusError(false);
    (itemType === 'tour'
      ? getTourWishlistStatus(accessToken, itemId)
      : getDestinationWishlistStatus(accessToken, itemId))
      .then((status) => {
        if (active) setIsWishlisted(status);
      })
      .catch((error: unknown) => {
        console.error('Failed to load tour wishlist status', error);
        if (active) {
          setWishlistStatusError(true);
          Alert.alert('Không thể tải wishlist', 'Vui lòng thử lại sau.');
        }
      })
      .finally(() => {
        if (active) setLoadingWishlistStatus(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, canWishlist, initialWishlisted, itemId, itemType]);

  const handleToggleWishlist = async () => {
    if (!canWishlist || !itemType || !itemId || togglingWishlist || loadingWishlistStatus) return;
    if (wishlistStatusError && (itemType === 'tour' || itemType === 'destination')) {
      setLoadingWishlistStatus(true);
      setWishlistStatusError(false);
      try {
        const status =
          itemType === 'tour'
            ? await getTourWishlistStatus(accessToken, itemId)
            : await getDestinationWishlistStatus(accessToken, itemId);
        setIsWishlisted(status);
      } catch (error) {
        console.error('Failed to retry tour wishlist status', error);
        setWishlistStatusError(true);
        Alert.alert('Không thể tải wishlist', 'Vui lòng thử lại sau.');
      } finally {
        setLoadingWishlistStatus(false);
      }
      return;
    }

    setTogglingWishlist(true);
    const prevState = isWishlisted;
    setIsWishlisted(!prevState);

    try {
      await toggleWishList(accessToken, itemType, itemId);
      const nextState = !prevState;
      setIsWishlisted(nextState);
      setCachedWishlistStatus(accessToken, itemType, itemId, nextState);
    } catch (error) {
      console.log("error toggle wishlist", error);
      setIsWishlisted(prevState);
      Alert.alert('Không thể cập nhật wishlist', 'Vui lòng thử lại.');
    } finally {
      setTogglingWishlist(false);
    }
  };

  return (
    <View
      style={{
        height: 320,
        justifyContent: "space-between",
        backgroundColor: "#27272a",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden",
      }}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          onLoad={() => console.log("HERO IMG OK")}
          onError={(e) => console.log("HERO IMG ERR", image, e.nativeEvent)}
        />
      ) : null}

      {/* Overlay */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(0,0,0,0.25)" }]} />

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
            disabled={
              togglingWishlist ||
              loadingWishlistStatus ||
              (wishlistStatusError && itemType !== 'tour' && itemType !== 'destination')
            }
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
          <Ionicons name="star" size={16} color="#FBBF24" />
          <AppText className="ml-2 font-semibold text-gray-800">
            {rating != null && reviews != null
              ? `${rating} (${reviews} đánh giá)`
              : "Chưa có đánh giá"}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default Hero;