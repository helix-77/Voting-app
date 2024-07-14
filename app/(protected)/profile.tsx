import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OwnedPolls_BottomSheet from "@/components/OwnedPolls_BottomSheet";

const Profile = () => {
  const { user } = useAuth();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleOwnedPolls = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="bg-gray-800 h-full">
          <View className="mx-4 my-4 ">
            <Text className=" text-gray-200">User id: {user?.email}</Text>
          </View>
          <TouchableOpacity
            onPress={handleOwnedPolls}
            className="bg-gray-700 rounded-lg my-2 mx-2 py-1"
          >
            <Text className="text-white text-base font-bold p-3">See all of your polls</Text>
          </TouchableOpacity>
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="bg-gray-700 rounded-lg   py-3 mt-3 mx-2"
              onPress={() => supabase.auth.signOut()}
            >
              <Text className="text-white font-semibold px-6 ">Sign out</Text>
            </TouchableOpacity>
          </View>
          {isBottomSheetVisible && <OwnedPolls_BottomSheet />}
        </View>
      </GestureHandlerRootView>
    </>
  );
};

export default Profile;
