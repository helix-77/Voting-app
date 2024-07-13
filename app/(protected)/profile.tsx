import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { Link, Redirect, router, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Touchable } from "react-native";

const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <View className="bg-gray-800 h-full">
        <View className="mx-4 my-4 ">
          <Text className=" text-gray-200">User id: {user?.email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("ownedPolls")}
          className="bg-gray-700 rounded-lg my-2 mx-2 py-1"
        >
          <Text className="text-white text-base font-bold p-4">See all of your polls</Text>
        </TouchableOpacity>
        <View className="mx-4 my-4 px-[15vh] ">
          <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
        </View>
      </View>
    </>
  );
};

export default Profile;
