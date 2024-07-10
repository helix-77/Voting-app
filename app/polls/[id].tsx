import { View, Text, Pressable, Button } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const poll = {
  question: "What is your favorite color?",
  options: ["Red", "Blue", "Green", "Yellow"],
};

const PollScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selected, setSelected] = useState("");

  const handleVote = () => {
    alert(`You selected ${selected}`);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Poll - " + id }} />
      <View className="h-full bg-gray-800">
        <View className="mx-4 my-4 ">
          <Text className="text-xl font-black mb-1 text-gray-200">{poll.question}</Text>
          {poll.options.map((option) => (
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
        <View className="h-[10vh] w-[12vh] mx-4 ">
          <Button title="Vote" onPress={handleVote} />
        </View>
      </View>
    </>
  );
};

export default PollScreen;
