import { View, Text } from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";
const LocationSection = ({ lat, long, location }) => {
  return (
    <View className="h-[420px] ml-4">
      <Text
        style={{ fontFamily: "Baskerville", fontSize: 25 }}
        className="text-[#0C0C0C] text-lg font-bold ml-1 mb-1"
      >
        Location
      </Text>
      <Text
        style={{ fontFamily: "Baskerville", fontSize: 16 }}
        className="ml-1 mb-2 text-sm text-[#0c0c0c] px-1"
      >
        Welcome to {location}, a bustling metropolis known for its rich history,
        diverse culture, and vibrant energy. From its world-class museums and
        cultural attractions, to its trendy shops and bustling nightlife, this
        city has something for everyone
      </Text>
      <View className="justify-center items-center">
        <MapView
          initialRegion={{
            latitude: lat ? lat : 37.78825,
            longitude: long ? long : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          className="h-60 w-96 mr-3"
        >
          <Marker
            coordinate={{
              latitude: lat ? lat : 37.78825,
              longitude: long ? long : -122.4324,
            }}
          />
        </MapView>
      </View>
      <View className="justify-content items-center">
        <View className="border-b-[1px] w-96 h-6 border-slate-500"></View>
      </View>
    </View>
  );
};

export default LocationSection;
