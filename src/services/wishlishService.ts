import { PagedResult } from "../types/destination";
import { WishlistHotelItem, WishlistTourItem } from "../types/wishlist";
import { getWithAuth, postWithAuth } from "./api";
export type WishlistItemType = "tour" | "hotel" | "destination";
export interface ToggleWishlistResult {
    isWishlisted: boolean;
}
export function toggleWishList(token: string | null, itemType: WishlistItemType, itemId: string) {
    return postWithAuth<ToggleWishlistResult>("/wishlists/toggle", token, { itemType, itemId, })
}

export async function getWishlistTours(token: string | null): Promise<WishlistTourItem[]> {
    const res = await getWithAuth<PagedResult<WishlistTourItem>>("/wishlists/tours", token);
    return res.data?.items ?? [];
}

export async function getWishlistHotels(token: string | null): Promise<WishlistHotelItem[]> {
    const res = await getWithAuth<PagedResult<WishlistHotelItem>>("/wishlists/hotels", token);
    return res.data?.items ?? [];
}

