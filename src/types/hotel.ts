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


export type HotelRoom = {
  id: string;
  roomType: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities: string;
  thumbnailUrl: string | null;
  isAvailable: boolean;
}


export type HotelImage = {
  id: string;
  url: string;
}

// Nếu backend có endpoint chi tiết /hotels/{id} trả nhiều field hơn (rooms, amenities...),
// bạn nên tách riêng HotelDetail giống pattern TourDetail. Tạm thời alias = Hotel.
export type HotelDetail = Hotel & {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  amenities?: string | null;
  images: HotelImage[];
  rooms?: HotelRoom[];
  
};

export type HotelSimple = Pick<
  Hotel,
  "id" | "name" | "thumbnailUrl" | "destinationName" | "minRoomPrice" | "averageRating"
>;

