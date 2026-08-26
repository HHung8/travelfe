import { AttractionSimple } from "../types/attraction";
import { ExploreType } from "../types/explore";
import { Hotel } from "../types/hotel";
import { Tour } from "../types/tour";

export type ExploreItem = {
    id:string;
    type: ExploreType;
    title: string;
    subtitle: string;
    thumbnailUrl: string | null;
    price: number | null;
    rating: number | null;
    reviewCount: number;
}


export function mapTour(item: Tour): ExploreItem {
    return {
        id: item.id,
        type: "tour",
        title: item.title,
        subtitle: item.destinationName,
        thumbnailUrl: item.thumbnailUrl,
        price: item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price,
        rating: item.averageRating,
        reviewCount: item.reviewCount,
    };
}

export function mapHotel(item: Hotel) : ExploreItem {
    return {
        id: item.id,
        type: "hotel",
        title: item.name,
        subtitle: item.destinationName,
        thumbnailUrl: item.thumbnailUrl,
        price: item.minRoomPrice,
        rating: item.averageRating,
        reviewCount: item.reviewCount,
    };
}

export function mapAttraction(item: AttractionSimple): ExploreItem {
    return {
        id: item.id,
        type: "attraction",
        title: item.name,
        subtitle: item.destinationName ?? "",
        thumbnailUrl: item.thumbnailUrl,
        price: item.entryFee ?? null,
        rating: null,
        reviewCount: 0,
    };
}