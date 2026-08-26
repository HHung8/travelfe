import { AttractionSimple } from "../types/attraction";
import { PagedResult } from "../types/destination";
import { getWithAuth } from "./api";

export type AttractionFilters = {
    keyword?: string;
    category?: string;
}

export function getAttractions(
    token: string | null,
    page = 1,
    pageSize = 10,
    filters?: AttractionFilters
) {
    return getWithAuth<PagedResult<AttractionSimple>>("/attractions", token, {
        page,
        pageSize,
        ...filters,
    });
}

export async function getAttractionsByDestination(
    token: string | null,
    destinationId: string
):Promise<AttractionSimple[]>{
    const res = await getWithAuth<AttractionSimple[]>(`/attractions/destinations/${destinationId}`, token);
    console.log(`check res attractions`, res);
    return res.data ?? [];
}