import { Destination, Tour } from "../types/home";

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Đà Nẵng",
    emoji: "🏖️",
    color: "#1D2145",
  },
  {
    id: "2",
    name: "Hội An",
    emoji: "🌿",
    color: "#0C473A",
  },
  {
    id: "3",
    name: "Sa Pa",
    emoji: "⛰️",
    color: "#3A2314",
  },
  {
    id: "4",
    name: "Đà Lạt",
    emoji: "🌲",
    color: "#21452F",
  },
];

export const popularTours: Tour[] = [
  {
    id: "1",
    title: "Khám phá Vịnh Hạ Long",
    duration: "3 ngày",
    rating: 4.9,
    price: 149,
    emoji: "🚣",
  },
  {
    id: "2",
    title: "Phố cổ Hội An",
    duration: "2 ngày",
    rating: 4.8,
    price: 89,
    emoji: "🏯",
  },
  {
    id: "3",
    title: "Săn mây Tà Xùa",
    duration: "2 ngày",
    rating: 4.9,
    price: 120,
    emoji: "☁️",
  },
];