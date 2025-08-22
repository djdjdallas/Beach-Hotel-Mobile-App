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
        title="Gary Clark Jr"
        subtitle="Sunny Side Up Tour"
        description="Gary Clark Jr. is an American musician, singer, songwriter, and record producer. He is known for his blues rock playing style, which has elements of soul, R&B, and hip hop."
        month="Oct"
        day="28"
        place="Tobacco Dock, London"
      />
      <Events
        imgUrl="https://i.ibb.co/Q677Zpw/matthew-kalapuch-sq-J4t-LBiurw-unsplash.jpg"
        subtitle="The Limelight Tour"
        title="Bearded Dragons"
        description="Bearded Dragons are a rock band from the United Kingdom. They are best known for their 2018 single, 'The Limelight Tour'. Get ready to dance and feel the rhythm of rock at an unforgettable concert experience. "
        month="Oct"
        day="28"
        place="San Francisco, CA"
      />
      <Events
        imgUrl="https://i.ibb.co/xmZ0JPP/kenny-eliason-KVB3-Pz-Q8s-Fo-unsplash.jpg"
        title="The Taste Buds"
        subtitle="The Taste Tour"
        description="The Taste Buds are a rock band from the United Kingdom. They are best known for their 2018 single, 'The Taste Tour'. Get ready to dance and feel the rhythm of rock at an unforgettable concert experience.  "
        month="Oct"
        day="28"
        place="San Francisco, CA"
      />
      <Events
        imgUrl="https://i.ibb.co/7k2mZgt/nyjah-gobert-Pp-DDv-Usep-CI-unsplash.jpg"
        title="Fireboy DML"
        subtitle="The Laughter, Tears & Goosebumps Tour"
        description="Fireboy DML is a Nigerian singer and songwriter. He is best known for his 2019 single, 'Laughter, Tears & Goosebumps'. Get ready to dance and feel the rhythm of Afrobeats at an unforgettable concert experience.  "
        month="Oct"
        day="28"
        place="San Francisco, CA"
      />
      <Events
        imgUrl="https://i.ibb.co/bJbkPMd/nick-karvounis-r-Ee-Akcn-Up-IU-unsplash.jpg"
        title="Liquid Death"
        subtitle="The Liquid Death Tour"
        description="Liquid Death is a rock band from the United Kingdom. They are best known for their 2018 single, 'The Liquid Death Tour'. Get ready to dance and feel the rhythm of rock at an unforgettable concert experience.  "
        month="Oct"
        day="28"
        place="San Francisco, CA"
      />
    </ScrollView>
  );
};

export default EventsRow;
