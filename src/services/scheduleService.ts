import { TourSchedule } from "../types/schedule";
import { getWithAuth } from "./api";

export async function getSchedulesByTour (token: string | null, tourId: string): Promise<TourSchedule[]> {
    const res = await getWithAuth<TourSchedule[]>(`/tours/${tourId}/schedules`, token);
    return res.data ?? [];
}

