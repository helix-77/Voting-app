import AuthProvider from "@/providers/AuthProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(protected)"
          options={{
            headerShown: true,
            title: "Account",
            headerStyle: {
              backgroundColor: "#1f2937",
            },
            headerTintColor: "#ffffff", // Ensure text is visible against the dark background
            headerShadowVisible: false, // Remove the bottom border on the header
          }}
        />
        <Stack.Screen
          name="polls/createPoll"
          options={{
            title: "Create Poll",
            headerStyle: {
              backgroundColor: "#1f2937",
            },
            headerTintColor: "#ffffff", // Ensure text is visible against the dark background
            headerShadowVisible: false, // Remove the bottom border on the header
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
