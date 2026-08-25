export interface TourSchedule {
    id: string;
    tourId: string;
    startDate: string;
    endDate: string;
    availableSlots: number;
    overridePrice: number | null;
}

