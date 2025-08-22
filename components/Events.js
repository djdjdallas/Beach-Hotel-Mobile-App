import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
const Events = ({
  imgUrl,
  place,
  month,
  day,
  title,
  description,
  subtitle,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="mr-4 bg-white rounded-lg mb-5"
      onPress={() =>
        navigation.navigate("EventsPage", {
          param: { imgUrl, place, month, day, title, description, subtitle },
        })
      }
    >
      <View className="rounded-lg">
        <Image
          source={{
            uri: imgUrl,
          }}
          className=" h-52 w-72 rounded-lg"
        />
      </View>
      <View className="flex-row space-x-4 ml-3 mt-1 mb-2 items-center">
        <View>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 22 }}
            className="text-orange-600 text-lg font-bold"
          >
            {month}
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 22 }}
            className=" text-gray-400 text-lg font-bold"
          >
            {day}
          </Text>
        </View>
        {/* {left side} */}
        <View>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 22 }}
            className="font-bold text-lg "
          >
            {title}
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="font-light mb-1"
          >
            Thu, {month} {day}{" "}
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 17 }}
            className=" font-semibold text-gray-600"
          >
            {place}
          </Text>
        </View>
        {/* right side */}
      </View>
    </TouchableOpacity>
  );
};

export default Events;
