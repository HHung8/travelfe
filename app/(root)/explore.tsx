import CategoryChip from '@/src/components/explore/CategoryChip'
import ExploreCard from '@/src/components/explore/ExploreCard'
import { categories, exploreData } from '@/src/data/explore'
import { ExploreType } from '@/src/types/explore'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { FlatList, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const explore = () => {
  const router = useRouter();
  const [activeType, setActiveType] = useState<"all" | ExploreType>("all");
  const filteredData = useMemo(
     () => (activeType === "all" ? exploreData : exploreData.filter((item) => item.type === activeType)),[activeType]
  )

  const handlePressItem = (item: (typeof exploreData)[number]) => {
      switch (item.type) {
      case "tour":
        router.push({ pathname: "/tour-detail", params: { tourId: item.id } });
        break;
      case "hotel":
        router.push({ pathname: "/hotel-detail", params: { hotelId: item.id } });
        break;
      case "attraction":
        router.push({ pathname: "/attraction-detail", params: { placeId: item.id } });
        break;
    }
  }
  
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4">
            <Text className="text-white text-4xl font-bold mb-6">Khám phá</Text>
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
            <View className="mt-6">
            {filteredData.map((item) => (
              <ExploreCard key={item.id} item={item} onPress={() => handlePressItem(item)} />
            ))}
          </View>
        </View>   

      </ScrollView>
    </SafeAreaView>
  )
}

export default explore