import { postWithAuth } from "./api";
export type WishlistItemType = "tour" | "hotel" | "destination";
export interface ToggleWishlistResult {
    isWishlisted: boolean;
}
export function toggleWishList(
    token: string | null,
    itemType: WishlistItemType,
    itemId:string
) {
    return postWithAuth<ToggleWishlistResult>("/wishlists/toggle", token, {itemType,itemId,})
}