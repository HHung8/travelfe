import CategoryChip from '@/src/components/explore/CategoryChip'
import ExploreCard from '@/src/components/explore/ExploreCard'
import { categories, exploreData } from '@/src/data/explore'
import { FlatList, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const explore = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
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
                    active={index === 0}
                  />
                )}
            />

            <View className="mt-6">
                 {exploreData.map((item) => (
                  <ExploreCard
                      key={item.id}
                      item={item}
                  />
            ))}

            </View>
        </View>   

      </ScrollView>
    </SafeAreaView>
  )
}

export default explore