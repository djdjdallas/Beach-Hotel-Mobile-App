import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import Promos from "./Promos";
const PromoRow = ({ title, name, imgUrl, index }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 10,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View className="rounded-lg">
        <Image
          source={{
            uri: imgUrl,
          }}
          className=" h-72 w-60 rounded-lg"
        />
        <View className="translate-y-[-83px] ml-2">
          <Text className=" font-semibold text-md text-black">
            Atractions & Activities
          </Text>
          <Text className="text-lg font-bold mb-1 text-black">{title}</Text>
          <View className="rounded-md bg-orange-400 w-20">
            <Text className=" p-1 text-white font-semibold ">Book Now</Text>
          </View>
        </View>
      </View>
      <Promos
        imgUrl="https://i.ibb.co/DQy6dMR/sasha-kaunas-67-s-Oi7m-VIk-unsplash.jpg"
        title="Japan"
      />
      <Promos
        imgUrl="https://i.ibb.co/Yj4fLfV/roberto-nickson-emqn-SQw-QQDo-unsplash.jpg"
        title="Austraila"
      />
      <Promos
        imgUrl="https://i.ibb.co/hcZz8TP/laura-lauch-f-XN1pj6-ZUSI-unsplash.jpg"
        title="Thailand"
      />
      <Promos
        imgUrl="https://i.ibb.co/547QRSy/roberto-nickson-Ri-Ohen-OLPs-unsplash.jpg"
        title="Colombia"
      />
    </ScrollView>
  );
};

export default PromoRow;
