import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import AppText from "@/src/components/common/AppText";
import { subscribeToSuccessToasts } from "@/src/utils/apiSuccessToast";

type Toast = {
  id: number;
  message: string;
};

const TOAST_DURATION_MS = 3200;

export default function ApiSuccessToastHost() {
  const [toast, setToast] = useState<Toast | null>(null);
  const queue = useRef<Toast[]>([]);
  const nextId = useRef(0);
  const activeToast = useRef<Toast | null>(null);

  useEffect(() => {
    return subscribeToSuccessToasts((message) => {
      const nextToast = { id: ++nextId.current, message };
      if (activeToast.current) {
        queue.current.push(nextToast);
      } else {
        activeToast.current = nextToast;
        setToast(nextToast);
      }
    });
  }, []);

  const showNextToast = useCallback(() => {
    const nextToast = queue.current.shift() ?? null;
    activeToast.current = nextToast;
    setToast(nextToast);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      showNextToast();
    }, TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [showNextToast, toast]);

  if (!toast) return null;

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-50 px-4"
      style={{ top: 52, elevation: 50 }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={showNextToast}
        accessibilityRole="alert"
        className="flex-row items-center rounded-2xl border border-emerald-400/30 bg-[#202b27] px-4 py-3 shadow-lg"
      >
        <View className="h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15">
          <Ionicons name="checkmark" size={20} color="#34d399" />
        </View>
        <AppText className="ml-3 flex-1 text-sm font-medium leading-5 text-white">
          {toast.message}
        </AppText>
        <Ionicons name="close" size={18} color="#a3a3a3" />
      </TouchableOpacity>
    </View>
  );
}
