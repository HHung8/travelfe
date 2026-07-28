
import BottomBooking from '@/src/components/detail/BottomBooking'
import Hero from '@/src/components/detail/Hero'
import MapCard from '@/src/components/detail/MapCard'
import NearbyCard from '@/src/components/detail/NearbyCard'
import TourInfo from '@/src/components/detail/TourInfo'
import { tourDetail } from '@/src/data/detail'
import React from 'react'
import { FlatList, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DetailScreen = () => {
    return (
        <SafeAreaView
            className="flex-1 bg-[#121212]"
            edges={["left", "right"]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 130,
                }}
            >
                <Hero
                    image={tourDetail.image}
                    rating={tourDetail.rating}
                    reviews={tourDetail.reviews}
                />

                <TourInfo
                    title={tourDetail.title}
                    location={tourDetail.location}
                    duration={tourDetail.duration}
                    maxGuest={tourDetail.maxGuest}
                    level={tourDetail.level}
                    description={tourDetail.description}
                />

                <MapCard />

                <View className="mt-8 px-6">
                    <Text className="text-white text-xl font-bold mb-5">
                        Địa điểm gần đó
                    </Text>

                    <FlatList
                        horizontal
                        data={tourDetail.nearby}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <NearbyCard item={item} />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />

                </View>
            </ScrollView>
            <BottomBooking price={tourDetail.price}/>

        </SafeAreaView>
    )
}

export default DetailScreen