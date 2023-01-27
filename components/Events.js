import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const Events = ({ imgUrl, place, month, day, title }) => {
  return (
    <TouchableOpacity className="mr-4 bg-white rounded-lg mb-5">
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
          <Text className="text-orange-600 text-lg font-bold">{month}</Text>
          <Text className=" text-gray-400 text-lg font-bold">{day}</Text>
        </View>
        {/* {left side} */}
        <View>
          <Text className="font-bold text-lg">{title}</Text>
          <Text className="font-light mb-1">
            Thu, {month} {day}{" "}
          </Text>
          <Text className=" font-semibold text-gray-600">{place}</Text>
        </View>
        {/* right side */}
      </View>
    </TouchableOpacity>
  );
};

export default Events;
