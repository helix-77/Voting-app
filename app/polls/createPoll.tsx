import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); // since Array of options

  const handleCreatePoll = () => {};

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Create Poll" }} />
      <View className="h-full bg-gray-800">
        <View className="mx-4 my-4 ">
          <View>
            <Text className="font-semibold text-base text-white">Title</Text>
            <TextInput
              className="font-semibold px-2 py-2 border border-gray-400 rounded-lg w-full mt-2 mb-4 text-white"
              value={question}
              placeholder="Write the Question..."
              placeholderTextColor="#7b7b8b"
              onChangeText={setQuestion}
            />
          </View>
          <View>
            <Text className="font-semibold text-base text-white">Options</Text>
            {options.map((option, index) => (
              <>
                <View className="flex flex-row items-center mr-6 space-x-1">
                  <TextInput
                    key={index}
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
                    onPress={() => setOptions(options.slice(0, -1))}
                  >
                    <MaterialIcons name="delete-forever" size={26} color="lightgray" />
                  </TouchableOpacity>
                </View>
              </>
            ))}
          </View>
          <View className="mt-4">
            <Button title="Add Option" onPress={() => setOptions([...options, ""])} />
            <Button title="Create Poll" onPress={handleCreatePoll} />
          </View>
        </View>
      </View>
    </>
  );
};

export default CreatePoll;
