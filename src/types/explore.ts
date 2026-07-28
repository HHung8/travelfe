export type ExploreType = "tour" | "hotel" | "attraction";

export interface ExploreCategory {
  id: string;
  title: string;
  type: "all" | ExploreType;
}

export interface ExploreItem {
  id: string;
  type: ExploreType;
  title: string;
  location: string;
  price: string; 
  rating: number;
  emoji: string;
  color: string;
  description?: string;
}