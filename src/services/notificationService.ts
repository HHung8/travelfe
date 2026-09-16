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

export async function markNotificationAsRead(token: string | null, id:string): Promise<void> {
    await putWithAuth(`/notifications/${id}/read`, token, {});
}

export async function markAllNotificationsAsRead(token: string | null): Promise<void> {
    await putWithAuth(`/notifications/read-all`, token, {});
}

export async function deleteNotification(token: string | null, id:string):Promise<void> {
    await deleteWithAuth(`/notifications/${id}`, token);
}