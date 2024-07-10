import {
  View,
  Text,
  Pressable,
  Button,
  Alert,
  ActivityIndicatorBase,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { PollType } from "@/types/db";
import { useAuth } from "@/providers/AuthProvider";

const PollScreen = () => {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [polls, setPolls] = useState<PollType>(null);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase.from("polls").select("*").eq("id", id).single();
      if (error) {
        Alert.alert("Error fetching polls", error.message);
      }
      setPolls(data);
    };
    fetchPolls();
  }, []);

  // mandatory check, else it will throw error
  if (!polls) {
    return <ActivityIndicator />;
  }

  const handleVote = () => {
    alert(`You selected ${selected}`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Poll - " + id }} />
      <View className="h-full bg-gray-800">
        <View className="mx-4 my-4 ">
          <Text className="text-xl font-black mb-1 text-gray-200">{polls.question}</Text>
          {polls.options.map((option) => (
            <Pressable
              onPress={() => setSelected(option)}
              key={option}
              className="flex flex-row gap-2 items-center mx-1 my-0.5"
            >
              <Feather
                name={option === selected ? "check-circle" : "circle"}
                size={24}
                color={option === selected ? "green" : "gray"}
              />
              <Text className="text-white">{option}</Text>
            </Pressable>
          ))}
        </View>
        <View className="mx-4 ">
          <Button title="Vote" onPress={handleVote} />
        </View>
      </View>
    </>
  );
};

export default PollScreen;
