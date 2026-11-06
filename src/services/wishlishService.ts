import { PagedResult } from "../types/destination";
import {
    WishlistAttractionItem,
    WishlistDestinationItem,
    WishlistHotelItem,
    WishlistTourItem,
} from "../types/wishlist";
import { getWithAuth, postWithAuth } from "./api";
export type WishlistItemType = "tour" | "hotel" | "destination" | "attraction";
export interface ToggleWishlistResult {
    isWishlisted: boolean;
}

let wishlistCacheToken: string | null | undefined;
const wishlistStatusCache = new Map<string, boolean>();

export function clearWishlistCache() {
    wishlistStatusCache.clear();
    wishlistCacheToken = undefined;
}

function prepareWishlistCache(token: string | null) {
    if (wishlistCacheToken !== token) {
        wishlistStatusCache.clear();
        wishlistCacheToken = token;
    }
}

function getWishlistCacheKey(itemType: WishlistItemType, itemId: string) {
    return `${itemType}:${itemId}`;
}

export function getCachedWishlistStatus(
    token: string | null,
    itemType: WishlistItemType,
    itemId: string
): boolean | undefined {
    prepareWishlistCache(token);
    return wishlistStatusCache.get(getWishlistCacheKey(itemType, itemId));
}

export function setCachedWishlistStatus(
    token: string | null,
    itemType: WishlistItemType,
    itemId: string,
    isWishlisted: boolean
) {
    prepareWishlistCache(token);
    wishlistStatusCache.set(getWishlistCacheKey(itemType, itemId), isWishlisted);
}

function syncCachedWishlistStatuses(
    token: string | null,
    itemType: WishlistItemType,
    items: { id: string }[]
) {
    prepareWishlistCache(token);
    const keyPrefix = `${itemType}:`;
    for (const key of wishlistStatusCache.keys()) {
        if (key.startsWith(keyPrefix)) {
            wishlistStatusCache.delete(key);
        }
    }
    for (const item of items) {
        wishlistStatusCache.set(getWishlistCacheKey(itemType, item.id), true);
    }
}

async function getAllWishlistItems<T extends { id: string }>(
    path: string,
    token: string | null,
    label: string
): Promise<T[]> {
    const pageSize = 100;
    const items: T[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const response = await getWithAuth<PagedResult<T>>(path, token, { page, pageSize });
        if (!response.data) {
            throw new Error(`Không nhận được ${label}`);
        }

        items.push(...response.data.items);
        const currentPage = response.data.page ?? page;
        const currentPageSize = response.data.pageSize || pageSize;
        totalPages =
            response.data.totalPages ||
            Math.ceil(response.data.totalCount / currentPageSize) ||
            currentPage;
        if (response.data.items.length === 0 || currentPage >= totalPages) break;
        page = currentPage + 1;
    }

    return items;
}

export function toggleWishList(
    token: string | null,
    itemType: WishlistItemType,
    itemId: string
) {
    return postWithAuth<ToggleWishlistResult>(
        "/wishlists/toggle",
        token,
        { itemType, itemId }
    );
}

export async function getTourWishlistStatus(token: string | null, tourId: string) {
    const items = await getWishlistTours(token);
    return items.some((item) => item.id === tourId);
}

export async function getHotelWishlistStatus(token: string | null, hotelId: string) {
    const items = await getWishlistHotels(token);
    return items.some((item) => item.id === hotelId);
}

export async function getDestinationWishlistStatus(token: string | null, destinationId: string) {
    const items = await getWishlistDestinations(token);
    return items.some((item) => item.id === destinationId);
}

export async function getAttractionWishlistStatus(token: string | null, attractionId: string) {
    const items = await getWishlistAttractions(token);
    return items.some((item) => item.id === attractionId);
}

export async function getWishlistTours(token: string | null): Promise<WishlistTourItem[]> {
    const items = await getAllWishlistItems<WishlistTourItem>(
        "/wishlists/tours",
        token,
        "danh sách tour yêu thích"
    );
    syncCachedWishlistStatuses(token, "tour", items);
    return items;
}

export async function getWishlistHotels(token: string | null): Promise<WishlistHotelItem[]> {
    const items = await getAllWishlistItems<WishlistHotelItem>(
        "/wishlists/hotels",
        token,
        "danh sách khách sạn yêu thích"
    );
    syncCachedWishlistStatuses(token, "hotel", items);
    return items;
}

export async function getWishlistDestinations(
    token: string | null
): Promise<WishlistDestinationItem[]> {
    const items = await getAllWishlistItems<WishlistDestinationItem>(
        "/wishlists/destinations",
        token,
        "danh sách điểm đến yêu thích"
    );
    syncCachedWishlistStatuses(token, "destination", items);
    return items;
}

export async function getWishlistAttractions(
    token: string | null
): Promise<WishlistAttractionItem[]> {
    const items = await getAllWishlistItems<WishlistAttractionItem>(
        "/wishlists/attractions",
        token,
        "danh sách địa điểm tham quan yêu thích"
    );
    syncCachedWishlistStatuses(token, "attraction", items);
    return items;
}
