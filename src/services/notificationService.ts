import { NotificationItem } from "../types/notification";
import { deleteWithAuth, getWithAuth, putWithAuth } from "./api";

interface NotificationListResponse {
    items: NotificationItem[];
    totalCount: number;
    unreadCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export async function getMyNotifications(token: string | null): Promise<{ items: NotificationItem[]; unreadCount: number }> {
  const res = await getWithAuth<NotificationListResponse>("/notifications", token);
  return {
    items: res.data?.items ?? [],
    unreadCount: res.data?.unreadCount ?? 0,
  };
}

export async function getAllMyNotifications(token: string | null): Promise<NotificationItem[]> {
  const pageSize = 100;
  const items: NotificationItem[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await getWithAuth<NotificationListResponse>("/notifications", token, { page, pageSize });
    if (!res.data) {
      throw new Error("Không tải được danh sách thông báo");
    }

    items.push(...res.data.items);
    const currentPage = res.data.page || page;
    const currentPageSize = res.data.pageSize || pageSize;
    totalPages = res.data.totalPages || Math.ceil(res.data.totalCount / currentPageSize) || currentPage;
    if (res.data.items.length === 0 || currentPage >= totalPages) break;
    page = currentPage + 1;
  }

  return items;
}

export async function markNotificationAsRead(token: string | null, id:string): Promise<void> {
    await putWithAuth(`/notifications/${id}/read`, token, {});
}

export async function markAllNotificationsAsRead(token: string | null): Promise<void> {
    await putWithAuth(`/notifications/read-all`, token, {});
}

export async function deleteNotification(token: string | null, id:string):Promise<void> {
    await deleteWithAuth(`/notifications/${id}`, token);
}