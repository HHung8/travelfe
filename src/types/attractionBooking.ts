export interface CreateAttractionBookingRequest {
    attractionId: string;
    scheduleId: string;
    numGuests: number;
    specialRequest?: string;
}

export interface AttractionBookingResult {
    id: string;
    bookingCode: string;
    attractionId: string;
    attractionName: string;
    thumbnailUrl: string;
    numGuests: number;
    visitDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}