import AllItemsScreen from "@/src/components/listing/AllItemsScreen";
import TourCard from "@/src/components/home/TourCard";
import { getTours } from "@/src/services/tourService";
import { Tour } from "@/src/types/tour";
import { useRouter } from "expo-router";

async function loadTours(
  token: string | null,
  page: number,
  pageSize: number,
  keyword: string | undefined
) {
  const response = await getTours(
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

export default function AllToursScreen() {
  const router = useRouter();

  return (
    <AllItemsScreen<Tour>
      title="Tất cả tour"
      subtitle="Khám phá những hành trình dành cho bạn"
      emptyText="Không tìm thấy tour nào"
      loadPage={loadTours}
      renderRow={(tour) => (
        <TourCard
          item={tour}
          onPress={() =>
            router.push({ pathname: "/tour-detail", params: { tourId: tour.id } })
          }
        />
      )}
    />
  );
}
