import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { ReactElement, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PageResult<T> = {
  items: T[];
  totalPages: number;
};

type PageLoader<T> = (
  token: string | null,
  page: number,
  pageSize: number,
  keyword: string | undefined
) => Promise<PageResult<T>>;

type Props<T extends { id: string }> = {
  title: string;
  subtitle: string;
  emptyText: string;
  loadPage: PageLoader<T>;
  renderRow: (item: T) => ReactElement | null;
};

const PAGE_SIZE = 20;

export default function AllItemsScreen<T extends { id: string }>({
  title,
  subtitle,
  emptyText,
  loadPage,
  renderRow,
}: Props<T>) {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    let active = true;

    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    loadPage(accessToken, page, PAGE_SIZE, keyword || undefined)
      .then((result) => {
        if (!active) return;
        setItems((current) => {
          if (page === 1) return result.items;
          const currentIds = new Set(current.map((item) => item.id));
          return [...current, ...result.items.filter((item) => !currentIds.has(item.id))];
        });
        setTotalPages(result.totalPages);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Không thể tải dữ liệu. Vui lòng thử lại."
        );
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        loadingMoreRef.current = false;
      });

    return () => {
      active = false;
    };
  }, [accessToken, keyword, loadPage, page, reloadKey]);

  const handleSearch = () => {
    loadingMoreRef.current = false;
    setLoading(true);
    setItems([]);
    setPage(1);
    setTotalPages(1);
    setKeyword(searchText.trim());
    setReloadKey((key) => key + 1);
  };

  const handleRefresh = () => {
    loadingMoreRef.current = false;
    setLoading(true);
    setRefreshing(true);
    setPage(1);
    setReloadKey((key) => key + 1);
  };

  const handleLoadMore = () => {
    if (loading || loadingMoreRef.current || page >= totalPages) return;
    loadingMoreRef.current = true;
    setPage((current) => current + 1);
  };

  const handleRetry = () => setReloadKey((key) => key + 1);

  const renderListItem: ListRenderItem<T> = ({ item }) => renderRow(item);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 36, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8B5CF6"
          />
        }
        ListHeaderComponent={
          <View className="pb-5 pt-3">
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              onPress={() => router.back()}
              className="mb-5 h-11 w-11 items-center justify-center rounded-full bg-[#242424]"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white">{title}</Text>
            <Text className="mt-2 text-sm text-neutral-400">{subtitle}</Text>
            <View className="mt-5 h-14 flex-row items-center rounded-2xl bg-[#242424] px-4">
              <Ionicons name="search-outline" size={20} color="#A3A3A3" />
              <TextInput
                accessibilityLabel={`Tìm ${title.toLowerCase()}`}
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                placeholder="Tìm kiếm..."
                placeholderTextColor="#737373"
                returnKeyType="search"
                className="ml-3 flex-1 py-3 text-white"
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Xóa nội dung tìm kiếm"
                  onPress={() => {
                    loadingMoreRef.current = false;
                    setLoading(true);
                    setSearchText("");
                    setItems([]);
                    setPage(1);
                    setTotalPages(1);
                    setKeyword("");
                    setReloadKey((key) => key + 1);
                  }}
                  className="p-1"
                >
                  <Ionicons name="close-circle" size={19} color="#A3A3A3" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Tìm kiếm"
                onPress={handleSearch}
                className="ml-2 p-1"
              >
                <Ionicons name="arrow-forward-circle" size={25} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color="#8B5CF6" size="large" style={{ marginTop: 36 }} />
          ) : error ? (
            <View className="items-center px-4 py-10">
              <Text className="text-center text-red-400">{error}</Text>
              <TouchableOpacity onPress={handleRetry} className="mt-4 rounded-xl bg-violet-600 px-5 py-3">
                <Text className="font-semibold text-white">Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text className="py-10 text-center text-neutral-400">{emptyText}</Text>
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color="#8B5CF6" style={{ paddingVertical: 20 }} />
          ) : error && items.length > 0 ? (
            <TouchableOpacity onPress={handleRetry} className="items-center py-5">
              <Text className="text-red-400">{error}</Text>
              <Text className="mt-2 font-semibold text-violet-400">Tải lại trang</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
