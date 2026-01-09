import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Icon } from '@rneui/themed';

const Slider = ({ item }) => {
  return (
    <ScrollView className="">
      <Image source={{ uri: item }} className="h-96 w-full" />
    </ScrollView>
  );
};

export default Slider;
