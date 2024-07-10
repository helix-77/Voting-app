import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      let { data: polls, error } = await supabase.from("polls").select("*");
      if (error) Alert.alert("Error fetching polls", error.message);
      setPolls(polls);
    };
    fetchPolls();
  }, []);

  return (
    <>
      <SafeAreaView className="bg-gray-800 h-full">
        <View className="flex flex-row items-center justify-between mx-2">
          {/* later change to profile/account dynamicaly */}
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
            // <Link className="bg-gray-700  my-2 mx-2 py-2 px-2 " href={`/polls/${item.id}`}>
            //   <Text className="text-white text-xl p-2 ">Question - {item.id}</Text>
            // </Link>

            <TouchableOpacity
              onPress={() => router.push(`polls/${item.id}`)}
              className="bg-gray-700 rounded-lg  my-2 mx-2 py-2 px-2 "
            >
              <Text className="text-white text-xl p-2 ">Question - {item.id}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </>
  );
}
