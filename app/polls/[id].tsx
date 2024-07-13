import { View, Text, Pressable, Button, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { PollType, VoteType } from "@/types/db";
import { useAuth } from "@/providers/AuthProvider";

const PollScreen = () => {
  const { user } = useAuth(); // custom hook to get user.id
  const { id } = useLocalSearchParams<{ id: string }>(); // custom hook to get the id from the URL
  const [poll, setPoll] = useState<PollType>(null); // to store the poll data
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      let { data, error } = await supabase
        .from("polls") // table name
        .select("*") // select all columns
        .eq("id", Number.parseInt(id)) // where id = parsed id from URL
        .single(); // get only one row
      if (error) {
        Alert.alert("Error fetching polls");
        console.log(error.message);
      }
      setPoll(data);
    };

    const fetchUserVote = async () => {
      if (!user) {
        return;
      }
      //else
      let { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", Number.parseInt(id))
        .eq("user_id", user.id)
        .limit(1) // limit to 1 row
        .single();
      if (data) {
        setSelected(data.option);
      }
      if (error) {
        console.log(error.message);
      }
    };

    fetchPolls();
    fetchUserVote();
  }, []);

  // mandatory check, else it will throw error
  if (!poll) {
    return <ActivityIndicator />;
  }

  const handleVote = async () => {
    if (!user) {
      Alert.alert("Unsuccessful", "Please Login to vote");
      return;
    }
    // Check if the vote already exists
    const { data: existingVote, error: fetchError } = await supabase
      .from("votes")
      .select("*")
      .eq("poll_id", Number.parseInt(id))
      .eq("user_id", user.id)
      .single();

    if (fetchError) {
      console.log(fetchError.message);
    }

    // If the vote exists, update it. Otherwise, insert a new vote
    let response;
    if (existingVote) {
      // Update the existing vote
      response = await supabase
        .from("votes")
        .update({ option: selected })
        .eq("poll_id", Number.parseInt(id))
        .eq("user_id", user.id)
        .select()
        .single();
    } else {
      // Insert a new vote
      response = await supabase
        .from("votes")
        .insert([{ poll_id: Number.parseInt(id), user_id: user.id, option: selected }])
        .select()
        .single();
    }

    const { data, error } = response;

    if (error) {
      Alert.alert("Unsuccessful", "Please Login to vote");
      console.log(error);
    } else {
      Alert.alert("Successful", `You voted ${selected}`);
    }

    router.replace("/");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Poll - " + id,
          headerStyle: {
            backgroundColor: "#1f2937",
          },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
        }}
      />
      <View className="h-full bg-gray-800">
        <View className="mx-4 my-4 ">
          <Text className="text-xl font-black mb-1 text-gray-200">{poll.question}</Text>
          {poll.options.map((option) => (
            <View key={option}>
              <Pressable
                //  key={option}
                onPress={() => setSelected(option)}
                className="flex flex-row gap-2 items-center mx-1 my-2 px-2 pb-2 bg-slate-700 rounded-lg"
              >
                <Feather
                  name={option === selected ? "check-circle" : "circle"}
                  size={22}
                  color={option === selected ? "green" : "gray"}
                />
                <Text className="text-white">{option}</Text>
              </Pressable>
            </View>
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
