import { Ionicons } from "@expo/vector-icons";
import AllItemsScreen from "@/src/components/listing/AllItemsScreen";
import { getDestinations } from "@/src/services/destinationService";
import { Destination } from "@/src/types/destination";
import { resolveImageUrl } from "@/src/utils/image";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500835556837-99ac94a94552";

async function loadDestinations(
  token: string | null,
  page: number,
  pageSize: number,
  keyword: string | undefined
) {
  const response = await getDestinations(
    token,
    page,
    pageSize,
    keyword ? { keyword } : undefined
  );
  return {
    items: response.data?.items ?? [],
    totalPages: response.data?.totalPages ?? page,
  };
}

export default function AllDestinationsScreen() {
  const router = useRouter();

  return (
    <AllItemsScreen<Destination>
      title="Tất cả điểm đến"
      subtitle="Tìm cảm hứng cho chuyến đi tiếp theo"
      emptyText="Không tìm thấy điểm đến nào"
      loadPage={loadDestinations}
      renderRow={(destination) => (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() =>
            router.push({ pathname: "/detail", params: { destinationId: destination.id } })
          }
          className="mb-4 flex-row overflow-hidden rounded-2xl bg-[#242424] p-3"
        >
          <Image
            source={{
              uri: resolveImageUrl(destination.thumbnailUrl) ?? FALLBACK_IMAGE,
            }}
            className="h-24 w-24 rounded-xl"
            resizeMode="cover"
          />
          <View className="ml-4 flex-1 justify-center">
            <Text className="text-lg font-bold text-white" numberOfLines={1}>
              {destination.name}
            </Text>
            <View className="mt-2 flex-row items-center">
              <Ionicons name="location-outline" size={15} color="#A3A3A3" />
              <Text className="ml-1 flex-1 text-sm text-neutral-400" numberOfLines={1}>
                {[destination.city, destination.country].filter(Boolean).join(", ")}
              </Text>
            </View>
            <Text className="mt-2 text-xs text-violet-400">
              {destination.tourCount} tour
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#737373"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      )}
    />
  );
}
