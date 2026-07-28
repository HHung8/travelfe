export const bookingData = [
    {
        id: "1",
        type: "tour",
        refId: "1", // khớp id trong popularTours (Khám phá Vịnh Hạ Long)
        status: "upcoming",
        title: "Vịnh Hạ Long 3N2Đ",
        date: "20 - 22 tháng 7, 2025",
        emoji: "🛶",
        color: "#35335A",
        badge: "Sắp tới",
        badgeColor: "#D9ECFF",
        badgeText: "#5B86B6",
    },
    {
        id: "2",
        type: "hotel",
        refId: "h1", // khớp id trong exploreData (Vinpearl Resort Nha Trang)
        status: "confirmed",
        title: "Vinpearl Nha Trang",
        date: "Check-in: 5 tháng 8, 2025",
        emoji: "🏨",
        color: "#3E6F63",
        badge: "Xác nhận",
        badgeColor: "#E2F4D7",
        badgeText: "#5B8E39",
    },
    {
        id: "3",
        type: "tour",
        refId: "3", // khớp id trong popularTours (Săn mây Tà Xùa) — đổi lại nếu bạn định dùng Sa Pa
        status: "pending",
        title: "Sa Pa Trekking Tour",
        date: "12 tháng 9, 2025",
        emoji: "🌺",
        color: "#70503E",
        badge: "Chờ TT",
        badgeColor: "#F4E7D2",
        badgeText: "#A67B3D",
    },
]