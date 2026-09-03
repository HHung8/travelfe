import { AttractionSimple } from "../types/attraction";
import { ExploreType } from "../types/explore";
import { Hotel } from "../types/hotel";
import { Tour } from "../types/tour";

export type ExploreItem = {
    id:string;
    type: ExploreType;
    title: string;
    subtitle: string;
    location?: string;
    description?: string;
    thumbnailUrl: string | null;
    price: number | null;
    rating: number | null;
    reviewCount: number;
    color?: string; // optional, for fallback visual
    emoji?: string; // optional, for fallback visual
}


export function mapTour(item: Tour): ExploreItem {
    return {
        id: item.id,
        type: "tour",   
        title: item.title,
        subtitle: item.destinationName,
        location: item.destinationName,
        thumbnailUrl: item.thumbnailUrl,
        price: item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price,
        rating: item.averageRating,
        reviewCount: item.reviewCount,
    };
}

export function mapHotel(hotel: Hotel): ExploreItem {
  return {
    id: hotel.id,
    type: "hotel",
    title: hotel.name,
    subtitle: hotel.destinationName,
    location: hotel.destinationName,
    description: hotel.description,
    thumbnailUrl: hotel.thumbnailUrl,
    price: hotel.minRoomPrice ?? null, // null = "chưa có giá" / "liên hệ", khác với 0
    rating: hotel.averageRating,
    reviewCount: hotel.reviewCount,
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