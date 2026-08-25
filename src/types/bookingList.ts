export interface TourBookingItem {
    id: string;
    bookingCode: string;
    tourId: string;
    tourTitle: string;
    thumbnailUrl: string | null;
    numGuests: number;
    totalPrice: number;
    status: string;
    travelDate: string;
    createdAt: string;
}

export interface HotelBookingItem {
  id: string;
  bookingCode: string;
  roomId: string;
  roomType: string;
  hotelName: string;
  thumbnailUrl: string | null;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Dạng chuẩn hoá dùng chung để hiển thị, bất kể nguồn là tour hay hotel
export interface UnifiedBookingItem {
  id: string;
  type: "tour" | "hotel";
  refId: string; // tourId (tour) hoặc roomId (hotel)
  title: string;
  dateLabel: string;
  thumbnailUrl: string | null;
  totalPrice: number;
  status: string;
  bookingCode: string;
}