import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const {user,logout} = useAuth();
  const router = useRouter();

  const handleLogout = async () => { 
  await logout();
  router.replace("/login");
  }

  return (
    <View className="bg-[#18274A] px-6 pt-6 pb-8 rounded-b-[30px]">
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-6 py-4 rounded-xl mt-10"
      >
        <Text className="text-white font-bold">
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}