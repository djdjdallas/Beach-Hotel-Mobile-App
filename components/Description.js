import { View, Text } from "react-native";
import React from "react";
import { Icon } from "react-native-elements";

const Description = ({ type, title, subDes }) => {
  return (
    <View className="h-72 my-2 ml-4">
      <Text
        style={{ fontFamily: "Baskerville", fontSize: 25 }}
        className="text-[#0C0C0C] text-lg mb-2 font-bold"
      >
        Description
      </Text>
      <Text
        style={{ fontFamily: "Baskerville", fontSize: 18 }}
        className="text-slate-600 text-sm px-1"
      >
        {!type ? subDes : null}
      </Text>
      <Text
        style={{ fontFamily: "Baskerville", fontSize: 20 }}
        className="text-slate-600 text-sm px-1"
      >
        {type == "hotels"
          ? `Looking for a comfortable and convenient place to stay? Look no further than ${title}. Our hotel offers a range of well-appointed rooms and suites, each equipped with all the amenities you need for a relaxed and comfortable stay. `
          : type == "restaurants"
          ? `Welcome to ${title}, a dining destination that promises to tantalize your taste buds and elevate your dining experience. Our menu features a variety of delicious dishes, made with only the freshest and finest ingredients, to suit every taste and occasion.`
          : type == "attractions"
          ? `Welcome to ${title}, a place where you can enjoy a variety of fun and exciting activities. Our park offers a range of attractions and facilities, including a swimming pool, a gym, and a spa, to ensure that you have a great time with your family and friends.`
          : ""}
      </Text>
      <View className="justify-content items-center">
        <View className="border-b-[1px] w-96 h-6 border-slate-500"></View>
      </View>
      <View className="flex-row justify-around items-center mt-3">
        <View className="flex-col justify-center items-center">
          <Icon name="wifi" type="material" color="#69DC9E" size={38} />
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-lg text-slate-500"
          >
            Wifi
          </Text>
        </View>
        <View className="flex-col">
          <Icon
            name="emoji-food-beverage"
            type="material"
            color="#69DC9E"
            size={38}
          />
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-lg text-slate-500"
          >
            Coffee
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <Icon name="bathtub" type="material" color="#69DC9E" size={38} />
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-lg text-slate-500"
          >
            Bath
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <Icon
            name="directions-car"
            type="material"
            color="#69DC9E"
            size={38}
          />
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-lg text-slate-500"
          >
            Car
          </Text>
        </View>
        <View className="flex-col justify-center items-center">
          <Icon name="pets" type="material" color="#69DC9E" size={38} />
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-lg text-slate-500"
          >
            Paw
          </Text>
        </View>
      </View>
      <View className="justify-content items-center">
        <View className="border-b-[1px] w-96 h-6 border-slate-500"></View>
      </View>
    </View>
  );
};

export default Description;
