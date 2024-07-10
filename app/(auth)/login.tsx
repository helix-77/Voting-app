import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState, TextInput, Button, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import { Redirect, router, Stack } from "expo-router";
import { SearchBar } from "@rneui/themed";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
    // redirect to profile
    router.replace("/profile");
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    else if (!session) Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <>
      <Stack.Screen options={{ title: "Account" }} />
      <View className="bg-gray-800 h-full">
        <View className="mx-4 my-4 ">
          <View>
            <Text className=" text-gray-200">Email</Text>
            <TextInput
              className="font-semibold px-2 py-2 border border-gray-400 rounded-lg w-full mt-2 mb-4 text-white"
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              placeholderTextColor={"#9CA3AF"}
              autoCapitalize={"none"}
            />
          </View>
          <View>
            <Text className=" text-gray-200">Password</Text>

            <TextInput
              className="font-semibold px-2 py-2 border border-gray-400 rounded-lg w-full mt-2 mb-4 text-white"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor={"#9CA3AF"}
              autoCapitalize={"none"}
            />
          </View>
          <View>
            <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
          </View>
          <View className="mt-2 flex flex-row items-center justify-center text-gray-200">
            <Text className="text-gray-200">Don't have an account? </Text>
            <View className="w-[10vh]">
              <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
