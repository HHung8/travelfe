import BookingSection from '@/src/components/booking/BookingSection'
import { bookingData } from '@/src/data/booking'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const BookingScreen = () => {
    const router = useRouter();
    const handlePressItem = (item: any) => {
        switch(item.type) {
            case "tour":
                router.push({ pathname: "/tour-detail", params: { tourId: item.refId } });
                break;
            case "hotel":
                router.push({ pathname: "/hotel-detail", params: { hotelId: item.refId } });
                break;
            case "attraction":
                router.push({ pathname: "/attraction-detail", params: { placeId: item.refId } });
                break;
        }   
    }
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                <Text className="text-white text-4xl font-bold mt-4 mb-8">Booking của tôi</Text>

                <BookingSection title="Sắp tới" data={bookingData.filter((x) => x.status === "upcoming")} onPressItem={handlePressItem} />
                <BookingSection title="Đã xác nhận" data={bookingData.filter((x) => x.status === "confirmed")} onPressItem={handlePressItem} />
                <BookingSection title="Chờ thanh toán" data={bookingData.filter((x) => x.status === "pending")} onPressItem={handlePressItem} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default BookingScreen