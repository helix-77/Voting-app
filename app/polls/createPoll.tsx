import { View, Text, TextInput, Button, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Link, Redirect, router, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // since Array of options
  const [quesErrorText, setQuesErrorText] = useState("");
  const [optionErrorText, setOptionErrorText] = useState("");

  const { user } = useAuth();

  const handleCreatePoll = async () => {
    setQuesErrorText("");
    setOptionErrorText("");

    if (!question) {
      setQuesErrorText("Question is required");
      return;
    }

    const validOptions = options.filter((option) => option.trim() !== "");
    if (validOptions.length < 2) {
      setOptionErrorText("At least 2 valid options are required");
      return;
    }

    const { data, error } = await supabase
      .from("polls")
      .insert([{ question, options: validOptions, creator_id: user?.id }])
      .select();
    if (error) {
      Alert.alert("Please login to create a poll.");
      console.log(error);
      return;
    }
    // Navigate to the index page upon successful poll creation
    router.replace("/");
  };

  return (
    <>
      <View className="h-full bg-gray-800">
        <View className="mx-4 my-4 ">
          <View>
            <Text className="font-semibold text-base text-white">Title</Text>
            <TextInput
              className="font-semibold px-2 py-2 border border-gray-400 rounded-lg w-full mt-2 mb-1 text-white"
              value={question}
              placeholder="Write the Question..."
              placeholderTextColor="#7b7b8b"
              onChangeText={setQuestion}
            />
            <Text className="font-light text-sm text-red-700 mb-2">{quesErrorText}</Text>
          </View>
          <View>
            <Text className="font-semibold text-base text-white">Options</Text>
            {options.map((option, index) => (
              <View key={index} className="flex flex-row items-center mr-6 space-x-1">
                <TextInput
                  className="text-white font-semibold px-2 py-2 border border-gray-400 rounded-lg w-full mt-2"
                  value={option}
                  placeholder={`Option ${index + 1}`}
                  placeholderTextColor="#7b7b8b"
                  onChangeText={(option) => {
                    const newOptionArray = [...options];
                    newOptionArray[index] = option;
                    setOptions(newOptionArray);
                  }}
                />
                <TouchableOpacity
                  className="mt-2"
                  onPress={() => {
                    const newOptionArray = [...options];
                    newOptionArray.splice(index, 1);
                    setOptions(newOptionArray);
                  }}
                >
                  <MaterialIcons name="delete-forever" size={26} color="lightgray" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <Text className="font-light text-sm text-red-700 mt-1">{optionErrorText}</Text>
          <View className="my-1 ">
            <Button title="Add Option" onPress={() => setOptions([...options, ""])} />
          </View>
          <Button title="Create Poll" onPress={handleCreatePoll} />
        </View>
      </View>
    </>
  );
};

export default CreatePoll;
