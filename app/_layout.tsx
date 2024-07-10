import AuthProvider from "@/providers/AuthProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ title: "Account" }} />
        <Stack.Screen name="polls/createPoll" options={{ title: "Create Poll" }} />
      </Stack>
    </AuthProvider>
  );
}
