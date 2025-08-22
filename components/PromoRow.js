import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import Promos from "./Promos";
const PromoRow = ({ title, name, imgUrl, index }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 3,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <Promos
        imgUrl="https://i.ibb.co/DQy6dMR/sasha-kaunas-67-s-Oi7m-VIk-unsplash.jpg"
        title="Japan"
        des="Discover the essence of Japanese hospitality at our hotel in the heart of Japan."
        subDes="Surrounded by lush greenery and tranquil gardens, our hotel offers a serene escape from the bustling city. Each room is thoughtfully designed with traditional Japanese elements and modern amenities to ensure a comfortable stay."
      />
      <Promos
        imgUrl="https://i.ibb.co/Yj4fLfV/roberto-nickson-emqn-SQw-QQDo-unsplash.jpg"
        title="Austraila"
        des="Discover the essence of Austraila hospitality at our hotel in the heart of Austraila."
        subDes="Surrounded by lush greenery and tranquil gardens, our hotel offers a serene escape from the bustling city. Each room is thoughtfully designed with traditional Austrailan elements and modern amenities to ensure a comfortable stay."
      />
      <Promos
        imgUrl="https://i.ibb.co/hcZz8TP/laura-lauch-f-XN1pj6-ZUSI-unsplash.jpg"
        title="Thailand"
        des="Discover the essence of Thailand hospitality at our hotel in the heart of Thailand."
        subDes="Surrounded by lush greenery and tranquil gardens, our hotel offers a serene escape from the bustling city. Each room is thoughtfully designed with traditional Thai elements and modern amenities to ensure a comfortable stay."
      />
      <Promos
        imgUrl="https://i.ibb.co/547QRSy/roberto-nickson-Ri-Ohen-OLPs-unsplash.jpg"
        title="Colombia"
        des="Discover the essence of Colombian hospitality at our hotel in the heart of Colombia."
        subDes="Surrounded by lush greenery and tranquil gardens, our hotel offers a serene escape from the bustling city. Each room is thoughtfully designed with traditional Colombian elements and modern amenities to ensure a comfortable stay."
      />
      <Promos
        imgUrl="https://i.ibb.co/547QRSy/roberto-nickson-Ri-Ohen-OLPs-unsplash.jpg"
        title="Colombia"
        des="Discover the essence of Colombian hospitality at our hotel in the heart of Colombia."
        subDes="Surrounded by lush greenery and tranquil gardens, our hotel offers a serene escape from the bustling city. Each room is thoughtfully designed with traditional Colombian elements and modern amenities to ensure a comfortable stay."
      />
    </ScrollView>
  );
};

export default PromoRow;
