import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 5167;

export function getApiOrigin(): string {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.manifest2 as any)?.extra?.expoGo?.debuggerHost;
  const debuggerHost = hostUri?.split(":")[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:${API_PORT}`;
  }
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${API_PORT}`;
  }
  return `http://localhost:${API_PORT}`;
}
