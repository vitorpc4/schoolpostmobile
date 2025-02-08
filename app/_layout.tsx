import { SessionProvider, useSession } from "@/Context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useExpoRouter } from "expo-router/build/global-state/router-store";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="createSchool" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </SessionProvider>
  );
}
