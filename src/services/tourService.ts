import { getWithAuth } from "@/src/services/api";
import { PagedResult } from "@/src/types/destination";
import { Tour, TourDetail, TourSimple } from "@/src/types/tour";

export type TourFilters = {
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
};

export function getTours(token:string | null, page = 1, pageSize = 10, filters?: TourFilters) {
    return getWithAuth<PagedResult<Tour>>("/tours", token, {page, pageSize, ...filters});
}

export async function getToursByDestination (
    token: string | null,
    destinationId: string
): Promise<TourSimple[]> {
    const res = await getWithAuth<TourSimple[]>(`/tours/by-destination/${destinationId}`, token);
    return res.data ?? [];
}

export async function getTourById(token: string | null, tourId: string):Promise<TourDetail | null> {
    const res = await getWithAuth<TourDetail>(`/tours/${tourId}`, token);
    return res.data;
}