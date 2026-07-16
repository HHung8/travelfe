import DestinationCard from "@/src/components/home/DestinationCard";
import Header from "@/src/components/home/Header";
import SearchBar from "@/src/components/home/SearchBar";
import SectionHeader from "@/src/components/home/SectionHeader";
import TourCard from "@/src/components/home/TourCard";
import { useAuth } from "@/src/context/AuthContext";
import { destinations, popularTours } from "@/src/data/home";
import { useRouter } from "expo-router";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {
  const {user,logout} = useAuth();
  const router = useRouter();

  const handleLogout = async () => { 
  await logout();
  router.replace("/login");
  }

 return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <Header />

        {/* Search */}
        <SearchBar />

        {/* Featured Destinations */}
        <View className="px-6 mt-6">
          <SectionHeader title="Điểm đến nổi bật" />

          <FlatList
            horizontal
            data={destinations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DestinationCard item={item} />
            )}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        </View>

        {/* Popular Tours */}
        <View className="px-6 mt-8">
          <SectionHeader title="Tour phổ biến" />

          <FlatList
            data={popularTours}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TourCard item={item} />
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}