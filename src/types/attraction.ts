// src/types/attraction.ts
export type AttractionSimple = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnailUrl: string | null;
  latitude: number;
  longitude: number;
  openingHours: string | null;
  entryFee: number | null;
  website: string | null;
  destinationId?:string;
  destinationName?:string
};