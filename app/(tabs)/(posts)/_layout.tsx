import { useSession } from "@/Context/AuthContext";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";

export default function PostsLayout() {
  const { checkSession } = useSession();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      checkSession()
        .then((result) => {
          if (!result) {
            router.push("/login");
          }
        })
        .catch((error) => {
          router.push("/login");

          console.log("Error: ", error);
        });
    }, [])
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen name="read" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
  );
}
