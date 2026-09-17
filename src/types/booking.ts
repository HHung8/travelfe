export interface CreateTourBookingRequest {
  tourId: string;
  scheduleId: string;
  numGuests: number;
  travelDate: string;
  specialRequest?: string;
}

export interface TourBookingResult {
    id: string;
    bookingCode: string;
    tourId: string;
    tourTitle: string;
    thumbnailUrl: string;
    numGuests: number;
    totalPrice: number;
    status: string;
    travelDate: string;
    createdAt: string;
}

export interface CreateHotelBookingRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  specialRequest?: string;
}

export interface HotelBookingResult {
  id: string;
  bookingCode: string;
  roomId: string;
  hotelId: string;
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