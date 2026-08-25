// src/types/destination.ts (bổ sung thêm vào file đã có)
export type DestinationDetail = {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  thumbnailUrl: string | null;
  latitude: number;
  longitude: number;
  climate: string | null;
  bestTimeToVisit: string | null;
  isFeatured: boolean;
  images: string[];
};