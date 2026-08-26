export type ExploreType = "tour" | "hotel" | "attraction";

export interface ExploreCategory {
  id: string;
  title: string;
  type: "all" | ExploreType;
}

export type ExploreItem = {
  id: string;
  type: ExploreType;
  title: string;
  subtitle: string;         // địa danh / category
  thumbnailUrl: string | null;
  price: number | null;
  rating: number | null;
  reviewCount: number;
};