import { View, Text, Image, ImageBackground, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
const promos = ({ imgUrl, title, subDes, des }) => {
  const navigation = useNavigation();
  console.log(imgUrl);
  return (
    <TouchableOpacity
      className="mr-4 relative"
      onPress={() =>
        navigation.navigate("Dummy", {
          param: { imgUrl, title, des, subDes },
        })
      }
    >
      <View className="rounded-lg">
        <Image source={{ uri: imgUrl }} className=" h-72 w-60 rounded-lg" />
        <View className="absolute top-52 ml-3 translate-y-[-15px]">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className=" font-semibold text-md text-white"
          >
            Atractions & Activities
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-lg font-bold mb-1 text-white"
          >
            {title}
          </Text>
          <View className="rounded-md bg-[#69DC9E] w-20">
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 15 }}
              className="p-1 text-white font-semibold "
            >
              Book Now
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default promos;
