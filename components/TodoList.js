import { View, Text, ScrollView } from "react-native";
import React from "react";

import EventsRow from "./EventsRow";

const TodoList = () => {
  return (
    <View className="h-96 ml-4">
      <Text
        style={{ fontFamily: "Baskerville", fontSize: 22 }}
        className="text-[#0C0C0C] text-lg font-bold ml-1 my-2"
      >
        Looking for things to do?
      </Text>
      <ScrollView>
        <EventsRow />
      </ScrollView>
    </View>
  );
};

export default TodoList;
