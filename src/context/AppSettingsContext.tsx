import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";

export type AppLanguage = "vi" | "en";
export type AppCurrency = "USD" | "VND";

export type NotificationCategories = {
  bookingUpdates: boolean;
  tripReminders: boolean;
  promotions: boolean;
};

type AppSettings = {
  language: AppLanguage;
  currency: AppCurrency;
  notificationCategories: NotificationCategories;
};

type StoredRate = {
  vndPerUsd: number;
  nextUpdateUnix: number;
};

type AppSettingsContextValue = AppSettings & {
  vndPerUsd: number | null;
  ready: boolean;
  loadError: string | null;
  setLanguage: (language: AppLanguage) => Promise<void>;
  setCurrency: (currency: AppCurrency) => Promise<void>;
  setNotificationCategory: (
    category: keyof NotificationCategories,
    enabled: boolean
  ) => Promise<void>;
};

const SETTINGS_KEY = "appSettings";
const RATE_KEY = "usdVndExchangeRate";
const DEFAULT_CATEGORIES: NotificationCategories = {
  bookingUpdates: true,
  tripReminders: true,
  promotions: true,
};
const DEFAULT_SETTINGS: AppSettings = {
  language: "vi",
  currency: "USD",
  notificationCategories: DEFAULT_CATEGORIES,
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

async function getStoredItem(key: string) {
  if (Platform.OS === "web") {
    if (typeof localStorage === "undefined") {
      throw new Error("Local storage is unavailable in this browser.");
    }
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setStoredItem(key: string, value: string) {
  if (Platform.OS === "web") {
    if (typeof localStorage === "undefined") {
      throw new Error("Local storage is unavailable in this browser.");
    }
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

function parseStoredRate(rateJson: string): StoredRate | null {
  try {
    const rate = JSON.parse(rateJson) as StoredRate;
    return Number.isFinite(rate.vndPerUsd) &&
      rate.vndPerUsd > 0 &&
      Number.isFinite(rate.nextUpdateUnix)
      ? rate
      : null;
  } catch (error) {
    console.warn("Ignoring malformed cached USD/VND exchange rate", error);
    return null;
  }
}

async function fetchUsdVndRate(): Promise<StoredRate> {
  const cachedRateJson = await getStoredItem(RATE_KEY);
  if (cachedRateJson) {
    const cachedRate = parseStoredRate(cachedRateJson);
    if (cachedRate && cachedRate.nextUpdateUnix * 1000 > Date.now()) {
      return cachedRate;
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  let response: Response;
  try {
    response = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Hết thời gian tải tỷ giá. Vui lòng thử lại.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    throw new Error("Không tải được tỷ giá USD/VND. Vui lòng thử lại.");
  }
  const data = (await response.json()) as {
    result?: string;
    rates?: { VND?: number };
    time_next_update_unix?: number;
  };
  const vndPerUsd = data.rates?.VND;
  const nextUpdateUnix = data.time_next_update_unix;
  if (
    data.result !== "success" ||
    !Number.isFinite(vndPerUsd) ||
    !vndPerUsd ||
    !Number.isFinite(nextUpdateUnix) ||
    !nextUpdateUnix
  ) {
    throw new Error("Tỷ giá USD/VND nhận được không hợp lệ.");
  }

  const rate = { vndPerUsd, nextUpdateUnix };
  await setStoredItem(RATE_KEY, JSON.stringify(rate));
  return rate;
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [vndPerUsd, setVndPerUsd] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [settingsJson, cachedRateJson] = await Promise.all([
          getStoredItem(SETTINGS_KEY),
          getStoredItem(RATE_KEY),
        ]);
        if (!active) return;

        if (settingsJson) {
          const stored = JSON.parse(settingsJson) as Partial<AppSettings>;
          const restoredSettings: AppSettings = {
            language: stored.language === "en" ? "en" : "vi",
            currency: stored.currency === "VND" ? "VND" : "USD",
            notificationCategories: {
              ...DEFAULT_CATEGORIES,
              ...stored.notificationCategories,
            },
          };
          setSettings(restoredSettings);
          if (restoredSettings.currency === "VND") {
            try {
              const rate = await fetchUsdVndRate();
              if (!active) return;
              setVndPerUsd(rate.vndPerUsd);
            } catch (error) {
              console.error("Failed to refresh USD/VND exchange rate", error);
              if (!active) return;
              if (!cachedRateJson) {
                setSettings({ ...restoredSettings, currency: "USD" });
              }
              setLoadError(
                error instanceof Error
                  ? error.message
                  : "Không tải được tỷ giá USD/VND. Vui lòng thử lại."
              );
            }
          }
        }
        if (cachedRateJson) {
          const cachedRate = parseStoredRate(cachedRateJson);
          if (cachedRate) {
            setVndPerUsd(cachedRate.vndPerUsd);
          }
        }
      } catch (error) {
        console.error("Failed to load app settings", error);
        if (active) setLoadError("Không tải được cài đặt đã lưu.");
      } finally {
        if (active) setReady(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const saveSettings = useCallback(async (nextSettings: AppSettings) => {
    await setStoredItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    setSettings(nextSettings);
  }, []);

  const setLanguage = useCallback(
    async (language: AppLanguage) => {
      await saveSettings({ ...settings, language });
    },
    [saveSettings, settings]
  );

  const setCurrency = useCallback(
    async (currency: AppCurrency) => {
      let updatedRate: number | null = null;
      if (currency === "VND") {
        const rate = await fetchUsdVndRate();
        updatedRate = rate.vndPerUsd;
      }
      await saveSettings({ ...settings, currency });
      if (updatedRate !== null) setVndPerUsd(updatedRate);
    },
    [saveSettings, settings]
  );

  const setNotificationCategory = useCallback(
    async (category: keyof NotificationCategories, enabled: boolean) => {
      await saveSettings({
        ...settings,
        notificationCategories: {
          ...settings.notificationCategories,
          [category]: enabled,
        },
      });
    },
    [saveSettings, settings]
  );

  const value = useMemo(
    () => ({
      ...settings,
      vndPerUsd,
      ready,
      loadError,
      setLanguage,
      setCurrency,
      setNotificationCategory,
    }),
    [
      settings,
      vndPerUsd,
      ready,
      loadError,
      setLanguage,
      setCurrency,
      setNotificationCategory,
    ]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
}
