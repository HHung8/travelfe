import { useAuth } from "@/src/context/AuthContext";
import { deleteNotification, getAllMyNotifications, getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/src/services/notificationService";
import { NotificationItem } from "@/src/types/notification";
import { getNotificationIcon } from "@/src/utils/notificationIcon";
import { parseActionUrl } from "@/src/utils/parseActionUrl";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import AppText from "@/src/components/common/AppText";
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
    const [deletingAll, setDeletingAll] = useState(false);
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

    const handleDelete = (notification: NotificationItem) => {
        Alert.alert("Xoá thông báo?", "Bạn không thể hoàn tác hành động này.", [
            { text: "Huỷ", style: "cancel" },
            {
                text: "Xoá",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteNotification(accessToken, notification.id);
                        setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
                        if (!notification.isRead) {
                            setUnreadCount((count) => Math.max(0, count - 1));
                        }
                    } catch (error: any) {
                        Alert.alert("Lỗi", error?.message || "Không xoá được thông báo");
                    }
                },
            },
        ]);
    };

    const handleDeleteAll = () => {
        Alert.alert("Xoá tất cả thông báo?", "Bạn không thể hoàn tác hành động này.", [
            { text: "Huỷ", style: "cancel" },
            {
                text: "Xoá tất cả",
                style: "destructive",
                onPress: async () => {
                    setDeletingAll(true);
                    try {
                        const allNotifications = await getAllMyNotifications(accessToken);
                        const results = await Promise.allSettled(
                            allNotifications.map((notification) => deleteNotification(accessToken, notification.id))
                        );
                        const deletedIds = new Set(
                            results.flatMap((result, index) => result.status === "fulfilled" ? [allNotifications[index].id] : [])
                        );
                        const deletedUnreadCount = allNotifications.filter(
                            (notification) => deletedIds.has(notification.id) && !notification.isRead
                        ).length;

                        setNotifications((prev) => prev.filter((notification) => !deletedIds.has(notification.id)));
                        setUnreadCount((count) => Math.max(0, count - deletedUnreadCount));

                        const failedCount = allNotifications.length - deletedIds.size;
                        if (failedCount > 0) {
                            Alert.alert("Lỗi", `Không xoá được ${failedCount} thông báo. Vui lòng thử lại.`);
                        }
                    } catch (error: any) {
                        Alert.alert("Lỗi", error?.message || "Không xoá được thông báo");
                    } finally {
                        setDeletingAll(false);
                    }
                },
            },
        ]);
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
                    <AppText className="text-white text-lg font-semibold ml-2">Thông báo</AppText>
                </View>
            </View>
            {(unreadCount > 0 || notifications.length > 0) && (
                <View className="flex-row justify-end items-center px-6 pt-3">
                    {unreadCount > 0 && (
                        <TouchableOpacity
                            onPress={handleMarkAllRead}
                            disabled={deletingAll}
                            className="mr-4"
                        >
                            <AppText className="text-indigo-400 text-xs font-medium">Đánh dấu đã đọc hết</AppText>
                        </TouchableOpacity>
                    )}
                    {notifications.length > 0 && (
                        <TouchableOpacity
                            onPress={handleDeleteAll}
                            disabled={deletingAll}
                            accessibilityRole="button"
                            accessibilityLabel="Xoá tất cả thông báo"
                        >
                            <AppText className={`text-xs font-medium ${deletingAll ? "text-red-400/50" : "text-red-400"}`}>
                                {deletingAll ? "Đang xoá..." : "Xoá tất cả"}
                            </AppText>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <ScrollView
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} tintColor="#8B5CF6" enabled={!deletingAll} />}
            >
                {error && <AppText className="text-red-400 mb-4">{error}</AppText>}

                {notifications.length === 0 && !error ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="notifications-outline" size={48} color="#525252" />
                        <AppText className="text-neutral-500 mt-4">Bạn chưa có thông báo nào</AppText>
                    </View>
                ) : (
                    notifications.map((n) => (
                        <View
                            key={n.id}
                            className={`flex-row rounded-2xl p-4 mb-3 items-start ${n.isRead ? "bg-[#242424]" : "bg-[#303030]"}`}
                        >
                            <TouchableOpacity
                                onPress={() => handlePressNotification(n)}
                                disabled={deletingAll}
                                className="flex-1 flex-row items-start"
                            >
                                <View className="w-10 h-10 rounded-full bg-neutral-700 items-center justify-center">
                                    <Ionicons name={getNotificationIcon(n.type) as any} size={18} color="#fff" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <AppText className={`text-sm ${n.isRead ? "text-neutral-300 font-normal" : "text-white font-semibold"}`}>
                                        {n.title}
                                    </AppText>
                                    <AppText className="text-neutral-400 text-sm mt-1">{n.message}</AppText>
                                    <AppText className="text-neutral-500 text-xs mt-1">{fmtTimeAgo(n.createdAt)}</AppText>
                                </View>
                                {!n.isRead && <View className="w-2 h-2 rounded-full bg-indigo-500 mt-1" />}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(n)}
                                disabled={deletingAll}
                                className="ml-2 p-2"
                                accessibilityRole="button"
                                accessibilityLabel="Xoá thông báo"
                            >
                                <Ionicons name="trash-outline" size={18} color="#f87171" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    )
}