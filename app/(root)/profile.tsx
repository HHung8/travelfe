import ProfileHeader from '@/src/components/profile/ProfileHeader';
import ProfileMenuItem from '@/src/components/profile/ProfileMenuItem';
import { useAuth } from '@/src/context/AuthContext';
import { getAttractionBookings, getHotelBookings, getTourBookings } from '@/src/services/bookingService';
import { getMyReviewsCount } from '@/src/services/reviewService';
import { getMyWishlistCount } from '@/src/services/wishlishService';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProfileCounts = {
  trips: number;
  reviews: number;
  wishlist: number;
};

const ProfileScreen = () => {
  const { accessToken, logout } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState<ProfileCounts | null>(null);
  const [countsError, setCountsError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setCountsError(null);

      const loadCounts = async () => {
        try {
          const [tourBookings, hotelBookings, attractionBookings, reviews, wishlist] = await Promise.all([
            getTourBookings(accessToken),
            getHotelBookings(accessToken),
            getAttractionBookings(accessToken),
            getMyReviewsCount(accessToken),
            getMyWishlistCount(accessToken),
          ]);
          if (isActive) {
            setCounts({
              trips: tourBookings.length + hotelBookings.length + attractionBookings.length,
              reviews,
              wishlist,
            });
          }
        } catch (error) {
          if (isActive) {
            setCountsError(error instanceof Error ? error.message : "Không tải được số liệu hồ sơ");
          }
        }
      };

      void loadCounts();
      return () => {
        isActive = false;
      };
    }, [accessToken])
  );

  const menus = [
    { title: "Danh sách yêu thích", icon: "heart-outline", route: "/favorites" },
    { title: "Đánh giá của tôi", icon: "star-outline", route: "/reviews" },
    { title: "Thông báo", icon: "notifications-outline", route: "/notifications" },
    { title: "Phương thức thanh toán", icon: "card-outline", route: "/payment-methods" },
    { title: "Cài đặt tài khoản", icon: "settings-outline", route: "/account-settings" },
  ] as const;

  const handleLogout = async () => {
    await logout();
  };

  return (
   <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          tripCount={counts?.trips ?? null}
          reviewCount={counts?.reviews ?? null}
          wishlistCount={counts?.wishlist ?? null}
        />
        {countsError && (
          <Text className="mx-5 mt-3 text-center text-sm text-red-400">
            {countsError}
          </Text>
        )}
        <View className="px-5 mt-6">
          {menus.map((item) => (
            <ProfileMenuItem
              key={item.title}
              title={item.title}
              icon={item.icon as any}
              onPress={() => router.push(item.route as any)}
            />
          ))}
          <ProfileMenuItem title="Đăng xuất" icon="log-out-outline" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen
