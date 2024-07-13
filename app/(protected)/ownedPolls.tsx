// import { View, Text, Alert, TouchableOpacity, FlatList, RefreshControl } from "react-native";
// import React, { useEffect, useState } from "react";
// import { router, Stack } from "expo-router";
// import { PollType } from "@/types/db";
// import { supabase } from "@/lib/supabase";

// const OwnedPolls = () => {
//   const [polls, setPolls] = useState<PollType[]>([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchPolls = async () => {
//     setRefreshing(true);
//     // enable read access based on uid
//     let { data: polls, error } = await supabase.from("polls").select("*");
//     if (error) Alert.alert("Error fetching polls", error.message);
//     setPolls(polls || []);
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     fetchPolls();
//   }, []);

//   return (
//     <>
//       <View className="bg-gray-800 h-full">
//         <FlatList
//           data={polls}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => router.push(`polls/${item.id}`)}
//               className="bg-gray-700 rounded-lg my-2 mx-2 py-2 px-2"
//             >
//               <Text className="text-white text-xl p-2">{item.question}</Text>
//             </TouchableOpacity>
//           )}
//           keyExtractor={(item) => item.id.toString()}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPolls} />}
//         />
//       </View>
//     </>
//   );
// };

// export default OwnedPolls;

import React, { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetFlatList,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { PollType } from "@/types/db";
import { useAnimatedStyle } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";

const OwnedPolls = () => {
  const { user } = useAuth(); // custom hook to get user.id

  // fetch
  const [polls, setPolls] = useState<PollType[]>([]);
  const sheetRef = useRef<BottomSheet>(null);

  const fetchPolls = async () => {
    // enable read access based on uid
    let { data: polls, error } = await supabase.from("polls").select("*");
    if (error) Alert.alert("Error fetching polls", error.message);
    setPolls(polls || []);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // .................................
  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []); // 25%, 50%, 90% height of the screen

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  //.....................

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

  // render
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => deletePoll(item)}>
        <View className="bg-gray-700 flex-1 flex-row justify-between items-center rounded-2xl my-2 mx-4 py-2 px-2 ">
          <Text className="text-white text-base p-2">{item.question}</Text>
          <MaterialCommunityIcons name="delete-sweep" size={24} color="white" />
        </View>
      </TouchableOpacity>
    ),
    []
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="bg-gray-800 flex-1 pt-[10vh]">
        <Button title="Pull Up" onPress={() => handleSnapPress(2)} />
        <Button title="Close" onPress={() => handleClosePress()} />
        <BottomSheet ref={sheetRef} snapPoints={snapPoints} onChange={handleSheetChange}>
          <BottomSheetFlatList
            data={polls}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default OwnedPolls;
