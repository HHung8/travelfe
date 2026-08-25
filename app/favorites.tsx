// import { popularTours } from "@/src/data/home";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// const favoriteTours = [popularTours[0], popularTours[popularTours.length - 1]];


export default function FavoritesScreen() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center px-4 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-semibold ml-2">Danh sách yêu thích</Text>
            </View>
            {/* <ScrollView contentContainerStyle={{padding: 24}} showsVerticalScrollIndicator={false}>
                {favoriteTours.length === 0 ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="heart-outline" size={48} color="#525252" />
                        <Text className="text-neutral-500 mt-4">Chưa có tour yêu thích nào</Text>
                    </View>
                ): (
                    favoriteTours.map((tour) => (
                        <TouchableOpacity
                            key={tour.id}
                            onPress={() => router.push({pathname: "/tour-detail", params:{tourId: tour.id}})}
                            className="bg-[#303030] rounded-2xl p-4 mb-4 flex-row items-center"
                        >
                            <View
                                className="w-16 h-16 rounded-xl items-center justify-center"
                                style={{backgroundColor: tour.color ?? "#20254F"}}
                            >
                                <Text className="text-3xl">{tour.emoji}</Text>
                            </View>
                            <View className="flex-1 ml-4">
                                <Text className="text-white font-bold text-lg">{tour.title}</Text>
                                <Text className="text-neutral-400 mt-1">{tour.duration} · ⭐ {tour.rating}</Text>
                            </View> 
                            <TouchableOpacity>
                                <Ionicons name="heart" size={22} color="#ef4444"/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView> */}
        </SafeAreaView>
    )
}