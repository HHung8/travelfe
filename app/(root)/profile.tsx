import ProfileHeader from '@/src/components/profile/ProfileHeader';
import ProfileMenuItem from '@/src/components/profile/ProfileMenuItem';
import { useAuth } from '@/src/context/AuthContext';
import { getAttractionBookings, getHotelBookings, getTourBookings } from '@/src/services/bookingService';
import { getMyReviewsCount } from '@/src/services/reviewService';
import { getMyWishlistCount } from '@/src/services/wishlishService';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import AppText from "@/src/components/common/AppText";
import { SafeAreaView } from 'react-native-safe-area-context';

type ProfileCounts = {
  trips: number;
  reviews: number;
  wishlist: number;
};

let cachedProfileCounts: { userId: string; counts: ProfileCounts } | null = null;

const ProfileScreen = () => {
  const { accessToken, logout, user } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState<ProfileCounts | null>(() => {
    const cached = cachedProfileCounts;
    return cached && cached.userId === user?.id ? cached.counts : null;
  });
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
            const nextCounts = {
              trips: tourBookings.length + hotelBookings.length + attractionBookings.length,
              reviews,
              wishlist,
            };
            cachedProfileCounts = { userId: user?.id ?? "", counts: nextCounts };
            setCounts((current) =>
              current?.trips === nextCounts.trips &&
              current.reviews === nextCounts.reviews &&
              current.wishlist === nextCounts.wishlist
                ? current
                : nextCounts
            );
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
    }, [accessToken, user?.id])
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
          <AppText className="mx-5 mt-3 text-center text-sm text-red-400">
            {countsError}
          </AppText>
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
