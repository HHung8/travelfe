
import DestinationInfo from '@/src/components/detail/DestinationInfo'
import DestinationTourCard from '@/src/components/detail/DestinationTourCard'
import Hero from '@/src/components/detail/Hero'
import MapCard from '@/src/components/detail/MapCard'
import NearbyCard from '@/src/components/detail/NearbyCard'
import { useAuth } from '@/src/context/AuthContext'
import { getAttractionsByDestination } from '@/src/services/attractionService'
import { getDestinationById } from '@/src/services/destinationService'
import { getToursByDestination } from '@/src/services/tourService'
import { AttractionSimple } from '@/src/types/attraction'
import { DestinationDetail } from '@/src/types/detinationdetail'
import { TourSimple } from '@/src/types/tour'
import { getDistanceKm } from '@/src/utils/distance'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500835556837-99ac94a94552";

const DetailScreen = () => {
    const { destinationId } = useLocalSearchParams<{ destinationId: string }>();
    const { accessToken } = useAuth();
    const router = useRouter();

    const [destination, setDestination] = useState<DestinationDetail | null>(null);
    const [loadingDestination, setLoadingDestination] = useState(true);
    const [errorDestination, setErrorDestination] = useState<string | null>(null);

    const [attractions, setAttractions] = useState<AttractionSimple[]>([]);
    const [loadingAttractions, setLoadingAttractions] = useState(true);

    const [tours, setTours] = useState<TourSimple[]>([]);
    const [loadingTours, setLoadingTours] = useState(true);

    useEffect(() => {
        if (!destinationId) return;
        fetchDetailData();
    }, [destinationId]);

    const fetchDetailData = async () => {
        setLoadingDestination(true);
        setLoadingAttractions(true);
        setLoadingTours(true);
        setErrorDestination(null);

        const [destinationOutcome, attractionsOutcome, toursOutcome] = await Promise.all([
            getDestinationById(accessToken, destinationId)
                .then((res) => ({ ok: true as const, data: res }))
                .catch((err) => ({ ok: false as const, error: err })),

            getAttractionsByDestination(accessToken, destinationId)
                .then((res) => ({ ok: true as const, data: res }))
                .catch((err) => ({ ok: false as const, error: err })),

            getToursByDestination(accessToken, destinationId)
                .then((res) => ({ ok: true as const, data: res }))
                .catch((err) => ({ ok: false as const, error: err })),
        ]);
        if (destinationOutcome.ok) {
            setDestination(destinationOutcome.data.data);
        } else {
            setErrorDestination(
                destinationOutcome.error?.message || "Không tải được thông tin điểm đến"
            );
        }
        setLoadingDestination(false);

        if (attractionsOutcome.ok) {
            setAttractions(attractionsOutcome.data ?? []);
        } else {
            setAttractions([]);
        }
        setLoadingAttractions(false);

        if (toursOutcome.ok) {
            setTours(toursOutcome.data ?? []);
        } else {
            setTours([]);
        }
        setLoadingTours(false);
    };

    if (loadingDestination) {
        return (
            <SafeAreaView className='flex-1 bg-[#121212] items-center justify-center'>
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        )
    }

    if (errorDestination || !destination) {
        return (
            <SafeAreaView className='flex-1 bg-[#121212] items-center justify-center px-6'>
                <Text className='text-red-400 text-center'>
                    {errorDestination || "Không tìm thấy điểm đến."}
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={["left", "right"]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
                <Hero
                    image={destination.thumbnailUrl || FALLBACK_IMAGE}
                    itemType="destination"
                    itemId={destination.id}
                />
                <DestinationInfo
                    title={destination.name}
                    location={`${destination.city}, ${destination.country}`}
                    climate={destination.climate}
                    bestTimeToVisit={destination.bestTimeToVisit}
                    description={destination.description}
                />

                <MapCard
                    locationLabel={`${destination.city}, ${destination.country}`}
                    latitude={destination.latitude}
                    longitude={destination.longitude}
                />

                <View className="mt-8 px-6">
                    <Text className="text-white text-xl font-bold mb-5">Tour tại đây</Text>
                    {loadingTours ? (
                        <ActivityIndicator color="#8B5CF6" />
                    ) : tours.length === 0 ? (
                        <Text className='text-neutral-500'>Chưa có tour nào tại điểm đến này</Text>
                    ) : (
                        <FlatList
                            horizontal
                            data={tours}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <DestinationTourCard
                                    item={item}
                                    onPress={() => router.push({ pathname: "/tour-detail", params: { tourId: item.id } })}
                                />
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                </View>

                <View className="mt-8 px-6">
                    <Text className="text-white text-xl font-bold mb-5">Địa điểm gần đó</Text>
                    {loadingAttractions ? (
                        <ActivityIndicator color="#8B5CF6" />
                    ) : attractions.length === 0 ? (
                        <Text className='text-neutral-500'>Chưa có địa điểm thăm quan nào gần đây</Text>
                    ) : (
                        <FlatList
                            horizontal
                            data={attractions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <NearbyCard
                                    item={{
                                        id: item.id,
                                        title: item.name,
                                        subtitle: item.entryFee ?? 0,
                                        distance: getDistanceKm(
                                            destination.latitude,
                                            destination.longitude,
                                            item.latitude,
                                            item.longitude
                                        )
                                    }}
                                />
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DetailScreen