import BottomBooking from '@/src/components/detail/BottomBooking';
import Hero from '@/src/components/detail/Hero';
import SafeImage from '@/src/components/detail/SafeImage';
import TourDetailSkeleton from '@/src/components/detail/TourDetailSkeleton';
import { useAuth } from '@/src/context/AuthContext';
import { getTourById } from '@/src/services/tourService';
import { TourDetail } from '@/src/types/tour';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const toBullets = (text: string): string[] => {
    const byNewline = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (byNewline.length > 1) return byNewline;
    const byComma = text.split(",").map((s) => s.trim()).filter(Boolean);
    return byComma.length > 1 ? byComma : [text];
};

const BulletSection = ({
    title,
    text,
    icon,
    color,
}: {
    title: string;
    text: string;
    icon: any;
    color: string;
}) => {
    if (!text) return null;
    const items = toBullets(text);
    return (
        <View className="mt-6">
            <Text className="text-white font-semibold text-lg mb-3">{title}</Text>
            <View className="gap-2">
                {items.map((item, idx) => (
                    <View key={idx} className="flex-row items-start">
                        <Ionicons name={icon} size={16} color={color} style={{ marginTop: 2 }} />
                        <Text className="text-neutral-300 text-sm leading-6 ml-2 flex-1">{item}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Đọc linh hoạt các tên field phổ biến cho 1 mục lịch trình — dò nhiều khả năng vì
// chưa biết chắc cấu trúc "schedules" thật từ backend.
const getScheduleLabel = (s: any, idx: number): string => {
    const dayNum = s?.dayNumber ?? s?.day ?? s?.order ?? idx + 1;
    return `Ngày ${dayNum}`;
};
const getScheduleTitle = (s: any): string | undefined => s?.title ?? s?.name ?? s?.activity;
const getScheduleDescription = (s: any): string | undefined => s?.description ?? s?.details ?? s?.content;

const ScheduleSection = ({ schedules }: { schedules: any[] }) => {
    if (!schedules || schedules.length === 0) return null;
    return (
        <View className="mt-6">
            <Text className="text-white font-semibold text-lg mb-3">Lịch trình</Text>
            <View className="gap-3">
                {schedules.map((s, idx) => (
                    <View key={idx} className="bg-neutral-900 rounded-2xl p-4">
                        <Text className="text-violet-400 font-semibold text-sm mb-1">{getScheduleLabel(s, idx)}</Text>
                        {!!getScheduleTitle(s) && (
                            <Text className="text-white font-medium">{getScheduleTitle(s)}</Text>
                        )}
                        {!!getScheduleDescription(s) && (
                            <Text className="text-neutral-400 text-sm mt-1 leading-6">{getScheduleDescription(s)}</Text>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const TourDetailScreen = () => {
    const { tourId } = useLocalSearchParams<{ tourId: string }>();
    const { accessToken } = useAuth();
    const router = useRouter();

    const [tour, setTour] = useState<TourDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTour = useCallback(async (isRefresh = false) => {
        if (!tourId) return;
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const data = await getTourById(accessToken, tourId);
            setTour(data);
        } catch (err: any) {
            setError(err?.message || "Không tải được thông tin tour");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [tourId, accessToken]);

    useEffect(() => {
        fetchTour();
    }, [fetchTour]);

    const handleShare = async () => {
        if (!tour) return;
        try {
            await Share.share({
                message: `Xem tour "${tour.title}" trên TravelApp — giá chỉ từ $${tour.discountPrice ?? tour.price}!`,
            });
        } catch (err) {
            console.log("error sharing tour", err);
        }
    };

    if (loading) {
        return <TourDetailSkeleton />;
    }

    if (error || !tour) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center px-6">
                <Ionicons name="alert-circle-outline" size={48} color="#525252" />
                <Text className="text-red-400 text-center mt-4">{error || "Không tìm thấy tour."}</Text>
                <TouchableOpacity
                    onPress={() => fetchTour()}
                    className="mt-6 bg-violet-600 px-6 py-3 rounded-2xl flex-row items-center"
                >
                    <Ionicons name="refresh" size={16} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Thử lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const hasDiscount = tour.discountPrice != null && tour.discountPrice < tour.price;
    const finalPrice = hasDiscount ? tour.discountPrice! : tour.price;

    return (
        <SafeAreaView className="flex-1 bg-[#121212]" edges={["left", "right"]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 130 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchTour(true)} tintColor="#8B5CF6" />
                }
            >
                <View className="relative">
                    <Hero
                        image={tour.thumbnailUrl}
                        rating={tour.averageRating}
                        reviews={tour.reviewCount}
                        itemType="tour"
                        itemId={tour.id}
                    />
                    <TouchableOpacity
                        onPress={handleShare}
                        className="absolute top-14 right-[72px] w-11 h-11 rounded-full bg-black/40 items-center justify-center"
                    >
                        <Ionicons name="share-social-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="px-6 mt-5">
                    <Text className="text-white text-2xl font-bold">{tour.title}</Text>

                    <TouchableOpacity
                        onPress={() => router.push({ pathname: "/detail", params: { destinationId: tour.destinationId } })}
                        className="flex-row items-center mt-1"
                    >
                        <Ionicons name="location-outline" size={14} color="#a3a3a3" />
                        <Text className="text-neutral-400 text-sm ml-1 underline">{tour.destinationName}</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center mt-3">
                        {hasDiscount && (
                            <Text className="text-neutral-500 text-sm line-through mr-2">${tour.price}</Text>
                        )}
                        <Text className="text-violet-500 text-xl font-bold">${finalPrice}</Text>
                        <Text className="text-neutral-500 text-xs ml-1">/ người</Text>
                    </View>

                    <View className="flex-row gap-2 mt-4 flex-wrap">
                        <View className="flex-row items-center bg-neutral-800 px-3 py-1.5 rounded-full">
                            <Ionicons name="time-outline" size={14} color="#d4d4d4" />
                            <Text className="text-neutral-300 text-xs ml-1">{tour.durationDays} ngày</Text>
                        </View>
                        <View className="flex-row items-center bg-neutral-800 px-3 py-1.5 rounded-full">
                            <Ionicons name="people-outline" size={14} color="#d4d4d4" />
                            <Text className="text-neutral-300 text-xs ml-1">Tối đa {tour.maxCapacity}</Text>
                        </View>
                        {!!tour.difficulty && (
                            <View className="flex-row items-center bg-neutral-800 px-3 py-1.5 rounded-full">
                                <Ionicons name="speedometer-outline" size={14} color="#d4d4d4" />
                                <Text className="text-neutral-300 text-xs ml-1">{tour.difficulty}</Text>
                            </View>
                        )}
                    </View>

                    {!!tour.description && (
                        <Text className="text-neutral-300 text-sm leading-6 mt-4">{tour.description}</Text>
                    )}

                    {tour.images && tour.images.length > 0 && (
                        <View className="mt-6">
                            <Text className="text-white font-semibold text-lg mb-3">Hình ảnh</Text>
                            <FlatList
                                horizontal
                                data={tour.images}
                                keyExtractor={(uri, idx) => `${idx}-${uri}`}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <SafeImage uri={item} className="w-32 h-32 rounded-2xl mr-3" resizeMode="cover" />
                                )}
                            />
                        </View>
                    )}

                    <BulletSection title="Điểm nổi bật" text={tour.highlights} icon="sparkles-outline" color="#facc15" />
                    <BulletSection title="Bao gồm" text={tour.includes} icon="checkmark-circle-outline" color="#4ade80" />
                    <BulletSection title="Không bao gồm" text={tour.excludes} icon="close-circle-outline" color="#f87171" />

                    <ScheduleSection schedules={tour.schedules} />
                </View>
            </ScrollView>

            <BottomBooking price={finalPrice} tourId={tour.id} />
        </SafeAreaView>
    );
};

export default TourDetailScreen;