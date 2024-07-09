import { View, Text, SafeAreaView, Pressable, Button } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
      <SafeAreaView>
        <View className="mx-4 my-4">
          <Text className="text-xl font-bold mb-1">{poll.question}</Text>
          {poll.options.map((option) => (
            <Pressable
              onPress={() => setSelected(option)}
              key={option}
              className="flex flex-row gap-2 items-center mx-1 my-0.5"
            >
              <Feather
                name={option === selected ? "check-circle" : "circle"}
                size={24}
                color={option === selected ? "green" : "black"}
              />
              <Text>{option}</Text>
            </Pressable>
          ))}
        </View>
        <Button title="Vote" onPress={handleVote} />
      </SafeAreaView>
    </>
  );
};

export default PollScreen;
