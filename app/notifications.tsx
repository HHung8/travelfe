import { useAuth } from "@/src/context/AuthContext";
import { deleteNotification, getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/src/services/notificationService";
import { NotificationItem } from "@/src/types/notification";
import { getNotificationIcon } from "@/src/utils/notificationIcon";
import { parseActionUrl } from "@/src/utils/parseActionUrl";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fmtTimeAgo = (iso: string): string => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Vừa xong"
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
};


export default function NotificationsScreen() {
    const router = useRouter();
    const { accessToken } = useAuth();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const { items, unreadCount } = await getMyNotifications(accessToken);
            setNotifications(items);
            setUnreadCount(unreadCount);
        } catch (error: any) {
            setError(error?.message || "Không tải được thông báo");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [accessToken]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications])

    const handlePressNotification = async (n: NotificationItem) => {
        if (!n.isRead) {
            setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)));
            setUnreadCount((c) => Math.max(0, c - 1));
            markNotificationAsRead(accessToken, n.id).catch((err) => console.log("error marking read", err));
        }

        if (n.actionUrl) {
            const { pathname, params } = parseActionUrl(n.actionUrl);
            router.push({ pathname: pathname as any, params });
        }
    };

    const handleMarkAllRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await markAllNotificationsAsRead(accessToken);
        } catch (err: any) {
            console.log("error marking all read", err);
        }
    };

    const handleDelete = async (id: string) => {
        const prev = notifications;
        setNotifications((list) => list.filter((n) => n.id !== id));
        try {
            await deleteNotification(accessToken, id);
        } catch (err: any) {
            setNotifications(prev); // revert nếu lỗi
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <ActivityIndicator color="#8B5CF6" size="large" />
            </SafeAreaView>
        );
    }



    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="flex-row items-center justify-between px-4 pt-4">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-semibold ml-2">Thông báo</Text>
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllRead} className="pr-2">
                        <Text className="text-indigo-400 text-sm font-medium">Đánh dấu đã đọc hết</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} tintColor="#8B5CF6" />}
            >
                {error && <Text className="text-red-400 mb-4">{error}</Text>}

                {notifications.length === 0 && !error ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="notifications-outline" size={48} color="#525252" />
                        <Text className="text-neutral-500 mt-4">Bạn chưa có thông báo nào</Text>
                    </View>
                ) : (
                    notifications.map((n) => (
                        <TouchableOpacity
                            key={n.id}
                            onPress={() => handlePressNotification(n)}
                            onLongPress={() => handleDelete(n.id)}
                            className={`flex-row rounded-2xl p-4 mb-3 items-start ${n.isRead ? "bg-[#242424]" : "bg-[#303030]"}`}
                        >
                            <View className="w-10 h-10 rounded-full bg-neutral-700 items-center justify-center">
                                <Ionicons name={getNotificationIcon(n.type) as any} size={18} color="#fff" />
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className={`text-sm ${n.isRead ? "text-neutral-300 font-normal" : "text-white font-semibold"}`}>
                                    {n.title}
                                </Text>
                                <Text className="text-neutral-400 text-sm mt-1">{n.message}</Text>
                                <Text className="text-neutral-500 text-xs mt-1">{fmtTimeAgo(n.createdAt)}</Text>
                            </View>
                            {!n.isRead && <View className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    )
}