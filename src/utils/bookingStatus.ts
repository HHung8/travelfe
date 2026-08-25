export const STATUS_LABEL: Record<string, {label: string, badgeColor: string, badgeText: string}> = {
  pending: { label: "Chờ thanh toán", badgeColor: "#F4E7D2", badgeText: "#A67B3D" },
  confirmed: { label: "Đã xác nhận", badgeColor: "#E2F4D7", badgeText: "#5B8E39" },
  completed: { label: "Hoàn tất", badgeColor: "#D9ECFF", badgeText: "#5B86B6" },
  cancelled: { label: "Đã huỷ", badgeColor: "#F4D7D7", badgeText: "#B65B5B" },
}

export function getStatusMeta(status: string) {
  return STATUS_LABEL[status] ?? { label: status, badgeColor: "#3A3A3A", badgeText: "#CCCCCC" };
}