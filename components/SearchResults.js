import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { useNavigation } from "@react-navigation/native";
const SearchResults = ({
  title,
  imgUrl,
  reviews,
  location,
  description,
  price,
  rating,
  data,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="mr-3"
      onPress={() =>
        navigation.navigate("PromoCard", {
          param: data,
        })
      }
    >
      <View className="rounded-lg">
        <Image
          source={{
            uri: imgUrl,
          }}
          className=" h-72 w-60 rounded-lg"
        />
        <View className="ml-1 my-3">
          <Text className=" font-semibold text-md text-black">{location}</Text>
          <Text className="text-lg font-bold mb-1 text-black">{title}</Text>
          <View className="rounded-md bg-orange-400 w-14 p-1 flex-row">
            <Icon type="material" name="star" color="#000" size={21} />
            <Text className=" p-1 text-black font-semibold ">{rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResults;
