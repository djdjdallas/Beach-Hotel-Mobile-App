import { View, Text } from "react-native";
import React from "react";
import Tours from "./Tours";
import { ScrollView } from "react-native";
const ToursRow = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 10,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <Tours
        imgUrl="https://i.ibb.co/3m2rpjr/daniel-bounliane-ove-Yd-Yj-ZQw-unsplash.jpg"
        title="Tour in Paris"
      />
      <Tours
        imgUrl="https://i.ibb.co/kSZPLV0/vaida-tamosauskaite-o-Jof-V8d-Zd-w-unsplash.jpg"
        title="Tour in Dubai"
      />
      <Tours
        imgUrl="https://i.ibb.co/y0cmGQq/charlesdeluvio-Z4vg9-A3xw-PA-unsplash.jpg"
        title="Tour in Thailand"
      />
      <Tours
        imgUrl="https://i.ibb.co/RpqHkN5/elevate-snnh-GYNqm44-unsplash.jpg"
        title="Tour in Germany"
      />
      <Tours
        imgUrl="https://i.ibb.co/smBwgyM/hasnain-babar-v-CV8n-JGAth-I-unsplash.jpg"
        title="Tour in America"
      />
    </ScrollView>
  );
};

export default ToursRow;
