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
  type,
  short_description,
  ranking,
  lat,
  long,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="mr-1 shadow-lg rounded-lg "
      onPress={() =>
        navigation.navigate("PromoCard", {
          param: {
            data,
            imgUrl,
            title,
            reviews,
            location,
            description,
            price,
            rating,
            type,
            short_description,
            ranking,
            lat,
            long,
          },
        })
      }
    >
      <View className="rounded-lg">
        <Image
          source={{
            uri: imgUrl,
          }}
          className="h-52 w-90 rounded-lg"
        />
        <View className="ml-1 my-3 flex-1 justify-center items-center">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 30 }}
            className="text-lg font-bold mb-1 text-black truncate"
          >
            {title}
          </Text>
          <View className="flex-row my-2">
            <Icon
              name="location-on"
              type="material"
              color="#00aced"
              size={25}
            />
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 23 }}
              className=" font-semibold text-md text-black p-1"
            >
              {location}
            </Text>
          </View>

          <View className="flex-row items-center space-x-[150px] my-1">
            <View className="rounded-md bg-[#69DC9E] w-14 p-1 flex-row">
              <Icon type="material" name="star" color="#000" size={21} />
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 17 }}
                className="p-1 text-[#0C0C0C] font-semibold "
              >
                {rating}
              </Text>
            </View>
            <View className="flex-row">
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 20 }}
                className=" text-black font-semibold"
              >
                +{reviews} reviews
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="border-b-[1px] border-gray-300 w-full mb-4 "></View>
    </TouchableOpacity>
  );
};

export default SearchResults;
