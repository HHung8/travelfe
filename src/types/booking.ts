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