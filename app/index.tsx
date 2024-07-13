import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { PollType } from "@/types/db";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [polls, setPolls] = useState<PollType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPolls = async () => {
    setRefreshing(true);
    let { data: polls, error } = await supabase.from("polls").select("*");
    if (error) Alert.alert("Error fetching polls", error.message);
    setPolls(polls || []);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <>
      <SafeAreaView className="bg-gray-800 h-full">
        <View className="flex flex-row items-center justify-between mx-2">
          {/* later change to profile/account dynamically */}
          <Link href={"/profile"} className="mt-0.5">
            <MaterialIcons name="account-circle" size={26} color="white" />
          </Link>
          <Text className="text-white text-2xl font-bold text-center p-4">Polls</Text>
          <Link href={"/polls/createPoll"} className="mt-0.5">
            <Entypo name="plus" size={26} color="white" />
          </Link>
        </View>
        <FlatList
          data={polls}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`polls/${item.id}`)}
              className="bg-gray-700 rounded-lg my-2 mx-2 py-2 px-2"
            >
              <Text className="text-white text-xl p-2">{item.question}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPolls} />}
        />
      </SafeAreaView>
    </>
  );
}
