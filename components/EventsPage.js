import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";

const EventsPage = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.param;
  const [tickets, setTickets] = useState(0);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    return () => {};
  }, []);

  const addTicket = () => {
    setTickets(tickets + 1);
  };

  const removeTicket = () => {
    if (tickets > 0) {
      setTickets(tickets - 1);
    }
  };
  return (
    <>
      <ScrollView className="h-screen bg-white">
        <View className="bg-white">
          <Image
            source={{ uri: data.imgUrl }}
            className="h-80 w-full bg-white"
          />
        </View>
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

        <View className="h-18 ml-2 p-3 my-2 bg-white">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 35 }}
            className="text-[#0C0C0C] text-4xl"
          >
            {data.title}
          </Text>
        </View>

        <View className="flex-row ml-4 bg-white">
          <View className="flex-row">
            <Image
              source={require("../assets/selfie1.jpg")}
              className="w-12 h-12 rounded-full border-[#fff] border-2 "
            />

            <Image
              source={require("../assets/selfie2.jpg")}
              className="w-12 h-12 rounded-full border-[#fff] border-2 translate-x-[-12px]"
            />

            <Image
              source={require("../assets/selfie3.jpg")}
              className="w-12 h-12 rounded-full border-[#fff] border-2 translate-x-[-24px]"
            />
          </View>
          <View className=" justify-center items-center ">
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 18 }}
              className="text-[#0C0C0C] text-xl"
            >
              Steve,Lincoln, Harry
            </Text>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 18 }}
              className="text-slate-600"
            >
              and 15 people like this
            </Text>
          </View>
          <TouchableOpacity className="ml-2 justify-center items-center">
            <Icon
              type="material"
              name="favorite-border"
              size={42}
              color="#69DC9E"
            />
          </TouchableOpacity>
        </View>

        {/* data and time section */}
        <View className="p-3 ml-2">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-[#0C0C0C] text-lg mb-2 font-bold"
          >
            Date/Time
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="text-black text-xl"
          >
            {data.month} {data.day}th 19:00- 22:00
          </Text>
        </View>
        {/* map */}
        <View className="ml-4">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-[#0C0C0C] text-lg ml-1 mb-2 font-bold"
          >
            Address
          </Text>

          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="text-[#0C0C0C] text-xl ml-2 mb-1"
          >
            {data.place}
          </Text>
          <View className="justify-center items-center">
            <MapView
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              className="h-60 w-96 mr-3"
            >
              <Marker
                coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
              />
            </MapView>
          </View>
        </View>

        {/* address & map section */}
        <View className="h-32 my-2 ml-4">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-[#0C0C0C] text-lg mb-2 font-bold"
          >
            Description
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="text-slate-600 text-sm"
          >
            {data.description}
          </Text>
        </View>
        {/*  description*/}

        {/* pricing section */}
        <View className="h-36 my-2 ml-4">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-[#0C0C0C] text-lg mb-2 font-bold"
          >
            Pricing
          </Text>
          <View>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 18 }}
              className="text-[#0C0C0C] text-lg font-semibold"
            >
              General Admission
            </Text>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 16 }}
              className="text-[#0C0C0C] my-1"
            >
              Provides a baseline experience for attendees. They also help you
              convert people who dont want to spend much.
            </Text>
          </View>
          <View className="flex-row justify-between my-1 items-center">
            <Text className="ml-2 text-lg text-[#69DC9E]">$199.99</Text>
            <View className="flex-row mr-6">
              <TouchableOpacity onPress={removeTicket}>
                <Icon type="material" name="remove-circle" size={30} />
              </TouchableOpacity>
              <Text className="text-lg mx-2">{tickets}</Text>
              <TouchableOpacity onPress={addTicket}>
                <Icon
                  type="material"
                  name="add-circle"
                  size={30}
                  color="#69DC9E"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="border-b-[1px] border-gray-300 w-full my-2"></View>
        </View>

        {/* pricing 2 */}
        <View className="h-26 my-2 ml-4">
          <View>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 18 }}
              className="text-[#0C0C0C] font-semibold my-1"
            >
              VIP Admission
            </Text>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 16 }}
              className="text-[#0C0C0C] my-1"
            >
              Provides a baseline experience for attendees. They also help you
              convert people who dont want to spend much.
            </Text>
          </View>
          <View className="flex-row justify-between my-1 items-center">
            <Text className="ml-2 text-lg text-[#69DC9E]">$299.99</Text>
            <View className="flex-row mr-6">
              <TouchableOpacity onPress={removeTicket}>
                <Icon type="material" name="remove-circle" size={30} />
              </TouchableOpacity>
              <Text className="text-lg mx-2">{tickets}</Text>
              <TouchableOpacity onPress={addTicket}>
                <Icon
                  type="material"
                  name="add-circle"
                  size={30}
                  color="#69DC9E"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="border-b-[1px] border-gray-300 w-full my-2"></View>
        </View>
        {/* pricing section 3 */}
        <View className="h-20 my-2 ml-4">
          <View>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 18 }}
              className="text-[#0C0C0C] font-semibold mb-1"
            >
              VIP / Reserve Seating
            </Text>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 16 }}
              className="text-[#0c0c0c] my-2"
            >
              Provides a baseline experience for attendees. They also help you
              convert people who dont want to spend much.
            </Text>
          </View>
          <View className="flex-row justify-between my-1 items-center">
            <Text className="ml-2 text-lg text-[#69DC9E]">$399.99</Text>
            <View className="flex-row mr-6">
              <TouchableOpacity onPress={removeTicket} className="">
                <Icon type="material" name="remove-circle" size={30} />
              </TouchableOpacity>
              <Text className="text-lg mx-2">{tickets}</Text>
              <TouchableOpacity onPress={addTicket}>
                <Icon
                  type="material"
                  name="add-circle"
                  size={30}
                  color="#69DC9E"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="border-b-[1px] border-gray-300 w-full my-2"></View>
        </View>

        {/* facilities section */}

        <View className=" mt-6 ml-2 p-3">
          <View>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 20 }}
              className="text-[#0C0C0C] text-lg font-bold my-2"
            >
              Facilities
            </Text>
          </View>
          <View className="flex-row p-1 my-1">
            <View className="flex-row bg-slate-400 w-24 rounded-full p-1 justify-center items-center mr-2">
              <Icon name="wifi" type="material" size={20} color="#69DC9E" />
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 16 }}
                className="ml-1"
              >
                Free Wifi
              </Text>
            </View>
            <View className="flex-row bg-slate-400 w-24 rounded-full p-1 justify-center items-center mr-2">
              <Icon name="bathtub" type="material" size={20} color="#69DC9E" />
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 16 }}
                className="ml-1"
              >
                Shower
              </Text>
            </View>
            <View className="flex-row bg-slate-400 w-28 rounded-full p-1 justify-center items-center">
              <Icon name="bathtub" type="material" size={20} color="#69DC9E" />
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 16 }}
                className="ml-1"
              >
                Pets Allowed
              </Text>
            </View>
          </View>
          <View className="flex-row p-1">
            <View className="flex-row bg-slate-400 w-28 rounded-full p-1 justify-center items-center mr-2">
              <Icon
                name="directions-bus"
                type="material"
                size={20}
                color="#69DC9E"
              />
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 16 }}
                className="ml-1"
              >
                Shuttle Bus
              </Text>
            </View>
            <View className="flex-row bg-slate-400 w-28 rounded-full p-1 justify-center items-center mr-2">
              <Icon
                name="smoke-free"
                type="material"
                size={20}
                color="#69DC9E"
              />
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 16 }}
                className="ml-1"
              >
                No Smoking
              </Text>
            </View>
            <View className="flex-row bg-slate-400 w-28 rounded-full p-1 justify-center items-center mr-2">
              <Icon name="bathtub" type="material" size={20} color="#69DC9E" />
              <Text
                style={{ fontFamily: "Baskerville", fontSize: 16 }}
                className="ml-1"
              >
                Open 24/7
              </Text>
            </View>
          </View>
          <View className="border-b-[1px] border-gray-300 w-full my-2"></View>
        </View>
      </ScrollView>
      <View className="h-24 w-full flex-row justify-between bg-white items-center border-t-[1px] border-slate-300 shadow-lg">
        <View className=" ml-10">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="text-slate-600 font-semibold"
          >
            AVG Price
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="text-[#69DC9E] font-semibold"
          >
            $399.99
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 18 }}
            className="text-slate-600 font-semibold "
          >
            Person/Ticket
          </Text>
        </View>
        <View>
          <TouchableOpacity className="p-3 bg-[#69DC9E] rounded-lg mr-10 ">
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 18 }}
              className="text-lg"
            >
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default EventsPage;
