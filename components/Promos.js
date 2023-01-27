import { View, Text, Image, ImageBackground, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
const promos = ({ imgUrl, title }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="mr-4 "
      onPress={() => {
        navigation.navigate("PromoCard");
      }}
    >
      <View className="rounded-lg">
        <Image
          source={{
            uri: imgUrl,
          }}
          className=" h-72 w-60 rounded-lg"
        />
        <View className="translate-y-[-83px] ml-2">
          <Text className=" font-semibold text-md text-white">
            Atractions & Activities
          </Text>
          <Text className="text-lg font-bold mb-1 text-white">{title}</Text>
          <View className="rounded-md bg-orange-400 w-20">
            <Text className=" p-1 text-white font-semibold ">Book Now</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default promos;
