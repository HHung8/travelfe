import DestinationCard from "@/src/components/home/DestinationCard";
import Header from "@/src/components/home/Header";
import SearchBar from "@/src/components/home/SearchBar";
import SectionHeader from "@/src/components/home/SectionHeader";
import TourCard from "@/src/components/home/TourCard";
import { useAuth } from "@/src/context/AuthContext";
import { getDestinations } from "@/src/services/destinationService";
import { getTours } from "@/src/services/tourService";
import { Destination } from "@/src/types/destination";
import { Tour } from "@/src/types/tour";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen() {
  const {accessToken,logout} = useAuth();
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [errorDestinations, setErrorDestinations] = useState<string | null>(null);

  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [errorTours, setErrorTours] = useState<string | null>(null);

  const fetchDestinations = async () => {
    setLoadingDestinations(true);
    setErrorDestinations(null);
    try {
      const res = await getDestinations(accessToken, 1, 10);
      console.log(`check response data`, res);
      setDestinations(res.data?.items ?? []);
    } catch (err: any) {
      setErrorDestinations(err.message || "Failed to fetch destinations");
    } finally {
      setLoadingDestinations(false);
    }
  }

  const fetchTours = async () => {
    setLoadingTours(true);
    setErrorTours(null);
    try{
      const res = await getTours(accessToken, 1, 10);
      console.log(`check res tour`, res);
      setTours(res.data?.items ?? []);
    }catch (err: any) {
      setErrorTours(err.message || "Failed to fetch tours");
    } finally {
      setLoadingTours(false);
    }
  }

  useEffect(() => {
    fetchDestinations();
    fetchTours();
  },[])

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  }

 return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <Header />
        {/* Search */}
        <SearchBar />
        {/* Featured Destinations */}
        <View className="px-6 mt-6">
          <SectionHeader title="Điểm đến nổi bật" />
          {loadingDestinations ? (
            <ActivityIndicator color="#8B5CF6"  style={{ marginTop: 16 }} />
          ) : errorDestinations ? (
            <Text className="text-red-400 mt-2">{errorDestinations}</Text>
          ) : (
            <FlatList 
              horizontal
              data={destinations}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => <DestinationCard item={item} />}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            />
          )}
        </View>

        {/* Popular Tours */}
        <View className="px-6 mt-8">
            <SectionHeader title="Tour phổ biến" />
            <FlatList
              data={tours}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TourCard
                  item={item}
                  onPress={() =>
                    router.push({ pathname: "/tour-detail", params: { tourId: item.id } })
                  }
                />
              )}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}