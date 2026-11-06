export interface WishlistTourItem {
    wishlistId: string;
    id:string;
    destiantionId: string;
    destinationName: string;
    title: string;
    price: number;
    discountPrice: number | null;
    durationDays: number;
    thumbnailUrl: string;
    averageRating: number | null;
    reviewCount: number;
    savedAt: string;
};

export interface WishlistHotelItem {
    wishlistId: string;
    id: string;
    destinationId: string;
    destinationName: string;
    name: string;
    thumbnailUrl: string | null;
    minRoomPrice: number | null;
    averageRating: number | null;
    reviewCount: number;
    savedAt: string;
}

export interface WishlistDestinationItem {
    wishlistId?: string;
    id: string;
    name: string;
    city?: string | null;
    country?: string | null;
    thumbnailUrl?: string | null;
    tourCount?: number | null;
    savedAt?: string;
}

export interface WishlistAttractionItem {
    wishlistId?: string;
    id: string;
    name: string;
    destinationId?: string | null;
    destinationName?: string | null;
    category?: string | null;
    thumbnailUrl?: string | null;
    entryFee?: number | null;
    savedAt?: string;
}