export interface Destination {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface Tour {
  id: string;
  title: string;
  duration: string;
  rating: number;
  price: number;
  emoji: string;
  location?: string;
  reviewCount?: number;
  maxGuests?: number;
  difficulty?: "Dễ" | "Trung bình" | "Khó";
  description?: string;
  color?: string;
  nearbyAttractions?: {
    name: string;
    distance: string;
  }[];
}