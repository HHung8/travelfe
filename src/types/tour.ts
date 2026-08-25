export type Tour = {
    id: string;
    title: string;
    description: string;
    price: number;
    discountPrice: number | null;
    durationDays: number;
    maxCapacity: number;
    difficulty: string;
    thumbnailUrl: string | null;
    averageRating: number | null;
    reviewCount: number;
    destinationId: string;
    destinationName: string;
};


export interface TourSimple {
    id: string;
    title: string;
    description: string;
    price: number;
    discountPrice: number | null;
    durationDays: number;
    maxCapacity: number;
    difficulty: string;
    thumbnailUrl: string;
    averageRating: number | null;
    reviewCount: number;
    destinationId: string;
    destinationName: string;
}


export interface TourDetail extends TourSimple {
    highlights: string;
    includes: string;
    excludes: string;
    images: string[];
    schedules: unknown[];
}