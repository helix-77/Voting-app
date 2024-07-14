import React, { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import BottomSheet, { BottomSheetFlatList, TouchableOpacity } from "@gorhom/bottom-sheet";
import { supabase } from "@/lib/supabase";
import { PollType } from "@/types/db";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";

const OwnedPolls_BottomSheet = () => {
  const { user } = useAuth(); // custom hook to get user.id

  // fetch
  const [polls, setPolls] = useState<PollType[]>([]);
  const sheetRef = useRef<BottomSheet>(null);

  const fetchPolls = async () => {
    let { data: polls, error } = await supabase.from("polls").select("*").eq("creator_id", user.id);
    if (error) Alert.alert("Error fetching polls", error.message);
    setPolls(polls || []);
  };

  // delete poll
  const deletePoll = async (item) => {
    const { error } = await supabase
      .from("polls")
      .delete()
      .eq("id", item.id)
      .eq("creator_id", user.id);
    if (error) Alert.alert("Error deleting poll", error.message);
    fetchPolls();
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const snapPoints = useMemo(() => ["40%", "65%", "100%"], []);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => deletePoll(item)}>
        <View
          style={{
            backgroundColor: "#1f2937",
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 15,
            marginVertical: 8,
            marginHorizontal: 16,
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}
        >
          <Text className="text-white py-2 px-2 bg-gray-800">{item.question}</Text>
          <MaterialCommunityIcons name="delete-sweep" size={24} color="white" />
        </View>
      </TouchableOpacity>
    ),
    []
  );

  const CustomBackground = ({ style }) => (
    <View
      style={[
        style,
        {
          backgroundColor: "#374151",
          borderRadius: 20,
        },
      ]}
    />
  );

  return (
    <View style={{ backgroundColor: "#1f2937", flex: 1 }}>
      <BottomSheet ref={sheetRef} snapPoints={snapPoints} backgroundComponent={CustomBackground}>
        <BottomSheetFlatList
          data={polls}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </BottomSheet>
    </View>
  );
};

export default OwnedPolls_BottomSheet;
