import React, { useLayoutEffect } from "react";
import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Icon } from '@rneui/themed';
import Slider from "./Slider";
const HotelPhotos = () => {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const photos = [
    "https://i.ibb.co/Yj4fLfV/roberto-nickson-emqn-SQw-QQDo-unsplash.jpg",
    "https://i.ibb.co/DQy6dMR/sasha-kaunas-67-s-Oi7m-VIk-unsplash.jpg",
    "https://i.ibb.co/547QRSy/roberto-nickson-Ri-Ohen-OLPs-unsplash.jpg",
    "https://i.ibb.co/hcZz8TP/laura-lauch-f-XN1pj6-ZUSI-unsplash.jpg",
  ];

  return (
    <View className="flex-1">
      <FlatList
        data={photos}
        renderItem={({ item }) => <Slider item={item} />}
        showsHorizontalScrollIndicator={true}
        pagingEnabled
      />
      <TouchableOpacity
        className="absolute top-14 left-5"
        onPress={() => {
          navigation.goBack();
        }}
      >
        <View>
          <Icon name="arrow-back" type="material" color="#fff" size={32} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HotelPhotos;
