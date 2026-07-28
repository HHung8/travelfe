import ProfileHeader from '@/src/components/profile/ProfileHeader';
import ProfileMenuItem from '@/src/components/profile/ProfileMenuItem';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const menus = [
    { title: "Danh sách yêu thích", icon: "heart-outline", route: "/favorites" },
    { title: "Đánh giá của tôi", icon: "star-outline", route: "/reviews" },
    { title: "Thông báo", icon: "notifications-outline", route: "/notifications" },
    { title: "Phương thức thanh toán", icon: "card-outline", route: "/payment-methods" },
    { title: "Cài đặt tài khoản", icon: "settings-outline", route: "/account-settings" },
  ] as const;

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
   <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader />
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
