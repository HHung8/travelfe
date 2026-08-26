import CategoryChip from '@/src/components/explore/CategoryChip'
import ExploreCard from '@/src/components/explore/ExploreCard'
import { useAuth } from '@/src/context/AuthContext'
import { categories } from '@/src/data/explore'
import { getAttractions } from '@/src/services/attractionService'
import { getHotels } from '@/src/services/hotelService'
import { getTours } from '@/src/services/tourService'
import { ExploreType } from '@/src/types/explore'
import { ExploreItem, mapAttraction, mapHotel, mapTour } from '@/src/utils/mapExplore'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const explore = () => {
  const router = useRouter();
  const {accessToken} = useAuth();
  const [activeType, setActiveType] = useState<"all" | ExploreType>("all");
  const [exploreData, setExploreData] = useState<ExploreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadExplore = useCallback( async () => {
    try {
      setError(null);
      const [toursRes, hotelsRes, attractionsRes] = await Promise.all([
        getTours(accessToken, 1, 20),
        getHotels(accessToken,1, 20),
        getAttractions(accessToken, 1,20),
      ]);
      const merged: ExploreItem[] = [
        ...(toursRes.data?.items ?? []).map(mapTour),
        ...(hotelsRes.data?.items ?? []).map(mapHotel),
        ...(attractionsRes.data?.items ?? []).map(mapAttraction),
      ];
      setExploreData(merged);
    } catch (error:any) {
        setError(error?.message ?? "Không thể tải dữ liệu khám phá");
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, [accessToken])

  useEffect(() => {
    loadExplore();
  }, [loadExplore])

  const handleRefresh = () => {
    setRefreshing(true);
    loadExplore();
  };
  
  const filteredData = useMemo(
    () => (activeType === "all" ? exploreData : exploreData.filter((item) => item.type === activeType)),
    [activeType, exploreData]
  );

  const handlePressItem = (item: ExploreItem) => {
    switch(item.type) {
      case "tour":
        router.push({pathname:"/tour-detail", params: {tourId: item.id}});
        break;
      case "hotel":
        router.push({pathname:"/hotel-detail", params: {hotelId: item.id}});
        break;
      case "attraction":
        router.push({pathname:"/attraction-detail", params: {placeId: item.id}});
        break;
      }
  }

  if(loading) {
    return (
      <SafeAreaView className='flex-1 bg-[#121212] items-center justify-center'>
          <ActivityIndicator color="#fff" size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#fff" />}  
      >
        <View className="px-6 pt-4">
            <Text className="text-white text-4xl font-bold mb-6">Khám phá</Text>
            {error && <Text className='text-red-400 mb-4'>{error}</Text>}
            <FlatList 
                horizontal
                data={categories}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <CategoryChip
                    title={item.title}
                    active={item.type === activeType}
                    onPress={() => setActiveType(item.type)}
                  />
                )}
            />
            <View className='mt-6'>
                {filteredData.length === 0 ? (
                  <Text className='text-gray-400 text-center mt-8'>Không có dữ liệu</Text>
                ): (
                  filteredData.map((item) => (
                    <ExploreCard key={`${item.type}-${item.id}`} item={item} onPress={() => handlePressItem(item)} />
                  ))
                )}
            </View>
            </View>   
      </ScrollView>
    </SafeAreaView>
  )
}

export default explore