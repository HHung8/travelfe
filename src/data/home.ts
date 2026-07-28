import { Destination, Tour } from "../types/home";

export const destinations: Destination[] = [
  { id: "1", name: "Đà Nẵng", emoji: "🏖️", color: "#1D2145" },
  { id: "2", name: "Hội An", emoji: "🌿", color: "#0C473A" },
  { id: "3", name: "Sa Pa", emoji: "⛰️", color: "#3A2314" },
  { id: "4", name: "Đà Lạt", emoji: "🌲", color: "#21452F" },
];

export const popularTours: Tour[] = [
  {
    id: "1",
    title: "Khám phá Vịnh Hạ Long",
    duration: "3 ngày",
    rating: 4.9,
    price: 149,
    emoji: "🚣",
    color: "#1D2145",
    location: "Quảng Ninh, Việt Nam",
    reviewCount: 128,
    maxGuests: 20,
    difficulty: "Trung bình",
    description:
      "Hải trình khám phá kỳ quan thiên nhiên thế giới, ngủ đêm trên vịnh, tham quan hang Sửng Sốt, Thiên Cung.",
    nearbyAttractions: [
      { name: "Hang Sửng Sốt", distance: "2km" },
      { name: "Làng Chài Vạn Chài", distance: "4km" },
      { name: "Hòn Gà Chọi", distance: "1km" },
    ],
  },
  {
    id: "2",
    title: "Phố cổ Hội An",
    duration: "2 ngày",
    rating: 4.8,
    price: 89,
    emoji: "🏯",
    color: "#0C473A",
    location: "Quảng Nam, Việt Nam",
    reviewCount: 96,
    maxGuests: 15,
    difficulty: "Dễ",
    description:
      "Dạo bước phố cổ, thả đèn hoa đăng trên sông Hoài, thưởng thức đặc sản địa phương.",
    nearbyAttractions: [
      { name: "Chùa Cầu", distance: "0.5km" },
      { name: "Sông Hoài", distance: "0.3km" },
      { name: "Bãi biển An Bàng", distance: "3km" },
    ],
  },
  {
    id: "3",
    title: "Săn mây Tà Xùa",
    duration: "2 ngày",
    rating: 4.9,
    price: 120,
    emoji: "☁️",
    color: "#3A2314",
    location: "Sơn La, Việt Nam",
    reviewCount: 74,
    maxGuests: 12,
    difficulty: "Khó",
    description:
      "Trekking săn mây trên đỉnh Tà Xùa, ngắm hoàng hôn, ngủ lều giữa biển mây.",
    nearbyAttractions: [
      { name: "Sống lưng khủng long", distance: "1km" },
      { name: "Bản Xím Vàng", distance: "5km" },
      { name: "Rừng nguyên sinh", distance: "3km" },
    ],
  },
];