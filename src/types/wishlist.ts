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