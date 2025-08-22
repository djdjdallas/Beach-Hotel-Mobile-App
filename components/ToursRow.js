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
        descrip="Explore the enchanting city of Paris with a guided tour. Discover the city's rich history, iconic landmarks, and breathtaking architecture. Stroll through the picturesque streets and admire the beauty of the Eiffel Tower, Notre-Dame Cathedral, the Louvre Museum, and more."
      />
      <Tours
        imgUrl="https://i.ibb.co/kSZPLV0/vaida-tamosauskaite-o-Jof-V8d-Zd-w-unsplash.jpg"
        title="Tour in Dubai"
        descrip="Explore the enchanting city of Dubai with a guided tour. Discover the city's rich history, iconic landmarks, and breathtaking architecture. Stroll through the picturesque streets and admire the beauty of the Eiffel Tower, Notre-Dame Cathedral, the Louvre Museum, and more."
      />
      <Tours
        imgUrl="https://i.ibb.co/y0cmGQq/charlesdeluvio-Z4vg9-A3xw-PA-unsplash.jpg"
        title="Tour in Thailand"
        descrip="Explore the enchanting city of Thailand with a guided tour. Discover the city's rich history, iconic landmarks, and breathtaking architecture. Stroll through the picturesque streets and admire the beauty of the Eiffel Tower, Notre-Dame Cathedral, the Louvre Museum, and more."
      />
      <Tours
        imgUrl="https://i.ibb.co/RpqHkN5/elevate-snnh-GYNqm44-unsplash.jpg"
        title="Tour in Germany"
        descrip="Explore the enchanting city of Germany with a guided tour. Discover the city's rich history, iconic landmarks, and breathtaking architecture. Stroll through the picturesque streets and admire the beauty of the Eiffel Tower, Notre-Dame Cathedral, the Louvre Museum, and more."
      />
      <Tours
        imgUrl="https://i.ibb.co/smBwgyM/hasnain-babar-v-CV8n-JGAth-I-unsplash.jpg"
        title="Tour in America"
        descrip="Explore the enchanting city of America with a guided tour. Discover the city's rich history, iconic landmarks, and breathtaking architecture. Stroll through the picturesque streets and admire the beauty of the Eiffel Tower, Notre-Dame Cathedral, the Louvre Museum, and more."
      />
    </ScrollView>
  );
};

export default ToursRow;
