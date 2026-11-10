import "@/global.css";
import ApiSuccessToastHost from "@/src/components/common/ApiSuccessToastHost";
import { AppSettingsProvider } from "@/src/context/AppSettingsContext";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function AuthRedirector() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const firstSegment = segments[0];

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = firstSegment === "(auth)";
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(root)/home");
    }
  }, [firstSegment, loading, router, user]);

  return null;
}

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <AuthRedirector />
        <Stack screenOptions={{ headerShown: false }} />
        <ApiSuccessToastHost />
      </AuthProvider>
    </AppSettingsProvider>
  )
}