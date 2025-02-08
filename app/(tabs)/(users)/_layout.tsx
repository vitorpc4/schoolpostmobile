import { useSession } from "@/Context/AuthContext";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";

export default function UsersLayout() {
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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
    </Stack>
  );
}
