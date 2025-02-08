import { Stack } from "expo-router";

export default function LayoutAdminPosts() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="create"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen name="edit" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
  );
}
