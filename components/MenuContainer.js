import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const MenuContainer = ({ type, setType, title, icon }) => {
  return (
    <View>
      <View className="w-[90px] h-20 ">
        <TouchableOpacity
          onPress={() => {
            setType(title.toLowerCase());
          }}
        >
          <View
            className={`flex shadow-sm justify-center items-center mt-3  w-24 h-16 rounded-md transition transform ease-in-out ${
              type === title.toLowerCase() ? "bg-gray-200" : ""
            }`}
          >
            {icon}
            <Text className="mt-2">{title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuContainer;
