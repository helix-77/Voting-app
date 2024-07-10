import { View, Text, Button } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: "Account" }} />
      <View className="bg-gray-800 h-full">
        <View className="mx-4 my-4 ">
          <Text className=" text-gray-200">User id: {user?.email}</Text>
        </View>
        <View className="mx-4 my-4 px-[15vh] ">
          <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
        </View>
      </View>
    </>
  );
};

export default Profile;
