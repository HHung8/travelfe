export type Destination = {
    id: string;
    name: string;
    country: string;
    city: string;
    description: string;
    thumbnailUrl: string | null;
    latitude: number;
    longitude: number;
    isFeatured: boolean;
    tourCount: number;
    hotelCount: number;
};

export type PagedResult<T> = {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}