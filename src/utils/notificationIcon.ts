export function getNotificationIcon(type: string): string {
    const map: Record<string, string> = {
        booking_success: "checkmark-circle-outline",
        payment_success: "card-outline",
        payment_failed: "close-circle-outline",
        booking_cancelled: "alert-circle-outline",
        promotion: "pricetag-outline",
        reminder: "time-outline",
        review_request: "star-outline",
    };
    return map[type] ?? "notifications-outline";
}