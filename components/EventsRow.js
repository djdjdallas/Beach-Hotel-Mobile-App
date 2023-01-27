import { View, Text, ScrollView } from "react-native";
import React from "react";
import Events from "./Events";

const EventsRow = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 10,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="shadow-sm "
    >
      <Events
        imgUrl="https://i.ibb.co/JvwYtsz/austin-neill-hg-O1w-FPXl3-I-unsplash-1.jpg"
        title="BBC Music Introducing"
        month="Oct"
        day="28"
        place="Tobacco Dock, London"
      />
      <Events
        imgUrl="https://i.ibb.co/Q677Zpw/matthew-kalapuch-sq-J4t-LBiurw-unsplash.jpg"
        title="Bearded Dragons"
        month="Oct"
        day="28"
        place="Madrid, Spain"
      />
      <Events
        imgUrl="https://i.ibb.co/xmZ0JPP/kenny-eliason-KVB3-Pz-Q8s-Fo-unsplash.jpg"
        title="The Taste Buds"
        month="Oct"
        day="28"
        place="Las Vegas, Nv"
      />
      <Events
        imgUrl="https://i.ibb.co/7k2mZgt/nyjah-gobert-Pp-DDv-Usep-CI-unsplash.jpg"
        title="Fireboy DML"
        month="Oct"
        day="28"
        place="San Isidro, Argentina"
      />
      <Events
        imgUrl="https://i.ibb.co/bJbkPMd/nick-karvounis-r-Ee-Akcn-Up-IU-unsplash.jpg"
        title="Liquid Death"
        month="Oct"
        day="28"
        place="Bogota, Colombia"
      />
    </ScrollView>
  );
};

export default EventsRow;
