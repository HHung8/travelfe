import { getWithAuth } from "@/src/services/api";
import { Destination, PagedResult } from "@/src/types/destination";
import { DestinationDetail } from "../types/detinationdetail";

export type DestinationFilters = {
    keyword?: string;
    country?: string;
}

export function getDestinations(token: string | null, page = 1, pageSize = 10, filters?: DestinationFilters) {
    return getWithAuth<PagedResult<Destination>>("/destinations", token, { page, pageSize, ...filters});
}

export function getDestinationById(token: string | null, id:string) {
    return getWithAuth<DestinationDetail>(`/destinations/${id}`, token);
}