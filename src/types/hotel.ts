export type Hotel = {
  id: string;
  name: string;
  address: string;
  starRating: number;
  description: string;
  thumbnailUrl: string | null;
  latitude: number;
  longitude: number;
  averageRating: number | null;
  reviewCount: number;
  destinationId: string;
  destinationName: string;
  minRoomPrice: number | null;
};

// Nếu backend có endpoint chi tiết /hotels/{id} trả nhiều field hơn (rooms, amenities...),
// bạn nên tách riêng HotelDetail giống pattern TourDetail. Tạm thời alias = Hotel.
export type HotelDetail = Hotel;

export type HotelSimple = Pick<
  Hotel,
  "id" | "name" | "thumbnailUrl" | "destinationName" | "minRoomPrice" | "averageRating"
>;

