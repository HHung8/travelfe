
export interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    actionUrl: string | null;
    metadata: string | null;
    createdAt: string;
}

