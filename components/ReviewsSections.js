import { View, Text } from "react-native";
import React from "react";

const ReviewsSections = ({ reviews, ranking }) => {
  return (
    <View>
      <View className="ml-5 mt-5 flex-row items-center space-x-2">
        <View className="bg-[#69DC9E] w-20 h-20 rounded-full justify-center items-center">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 30 }}
            className="text-white text-xl"
          >
            {ranking ? ranking : "9.5"}
          </Text>
        </View>
        <View>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 35 }}
            className="text-2xl text-[#69DC9E] font-light"
          >
            Excellent
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-[#0c0c0c]"
          >
            See {reviews} reviews
          </Text>
        </View>
      </View>

      {/* design scales section */}
      <View className="flex-row justify-around items-center my-10">
        <View className="">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="mb-1 text-[#0c0c0c]"
          >
            Exterior Design
          </Text>
          <View className="flex-row">
            <View className="bg-slate-500 w-32 h-4 rounded-l-lg"></View>
            <View className="bg-[#69DC9E] w-10 h-4 rounded-r-lg"></View>
          </View>
        </View>
        <View>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="mb-1 text-[#0c0c0c]"
          >
            Comfort Level
          </Text>
          <View className=" flex-row">
            <View className="bg-slate-500 w-32 h-4  rounded-l-lg"></View>
            <View className="bg-[#69DC9E] w-10 h-4 rounded-r-lg"></View>
          </View>
        </View>
      </View>
      <View className="flex-row justify-around items-center">
        <View>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="mb-1 text-[#0c0c0c]"
          >
            Interior Design
          </Text>
          <View className="flex-row">
            <View className="bg-slate-500 w-32 h-4 rounded-l-lg"></View>
            <View className="bg-[#69DC9E] w-10 h-4 rounded-r-lg"></View>
          </View>
        </View>

        <View className="rounded-full">
          <View className="">
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 18 }}
              className="mb-1 text-[#0c0c0c]"
            >
              Server Quality
            </Text>
          </View>
          <View className="flex-row">
            <View className="bg-slate-500 w-10 h-4 rounded-l-lg"></View>
            <View className="bg-[#69DC9E] w-32 h-4 rounded-r-lg"></View>
          </View>
        </View>
      </View>
      <View className="justify-content items-center">
        <View className="border-b-[1px] w-96 h-6 border-slate-500"></View>
      </View>
    </View>
  );
};

export default ReviewsSections;
