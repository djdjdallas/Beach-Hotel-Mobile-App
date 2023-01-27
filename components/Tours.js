import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const Tours = ({ imgUrl, title }) => {
  return (
    <TouchableOpacity className="mr-3">
      <Image
        source={{
          uri: imgUrl,
        }}
        className="h-52 w-40 rounded-lg"
      />
      <View className="translate-y-[-30px] ml-2">
        <Text className="text-white text-lg font-bold">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Tours;
