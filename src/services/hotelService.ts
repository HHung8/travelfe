import { PagedResult } from "../types/destination";
import { Hotel, HotelDetail, HotelSimple } from "../types/hotel";
import { getWithAuth } from "./api";

export type HotelFilters = {
    keyword?:string;
    minPrice?:number;
    maxPrice?:number;
    starRating?:number;
}

export function getHotels(token:string | null, page = 1, pageSize = 10, filters?:HotelFilters) {
    return getWithAuth<PagedResult<Hotel>>("/hotels", token, {page, pageSize, ...filters});
}

export async function getHotelsByDestination(
    token: string | null,
    destinationId: string
): Promise<HotelSimple[]> {
    const res = await getWithAuth<HotelSimple[]>(`/hotels/by-destination/${destinationId}`, token);
    return res.data ?? [];
}

export async function getHotelById(token: string | null, hotelId: string):Promise<HotelDetail | null> {
    const res = await getWithAuth<HotelDetail>(`/hotels/${hotelId}`, token);
    return res.data;
}