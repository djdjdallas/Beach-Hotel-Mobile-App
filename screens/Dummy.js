import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from '@rneui/themed';

import ReviewsSections from "../components/ReviewsSections";
import SearchResults from "../components/SearchResults";
import Description from "../components/Description";
import LocationSection from "../components/LocationSection";
import TodoList from "../components/TodoList";

const Dummy = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.param;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [image, setImage] = useState(null);

  return (
    <>
      <ScrollView className="h-96 bg-white">
        <View className="bg-black shadow-lg w-full relative">
          <Image
            source={{ uri: data?.imgUrl }}
            className="w-screen h-72 object-contain"
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

        <TouchableOpacity
          className="absolute right-10 top-14"
          onPress={() => navigation.navigate("HotelPhotos")}
        >
          <View>
            <Icon
              name="photo-library"
              type="material"
              color="#69DC9E"
              size={32}
            />
          </View>
        </TouchableOpacity>

        {/* title and short description section */}
        <View className="justify-center items-center ">
          <View className="flex-col items-center justify-between mt-4 h-36 w-96 bg-white rounded-2xl shadow-xl border-[1px] border-slate-300">
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 30 }}
              className="text-2xl"
            >
              {data?.title}
            </Text>
            <Text
              style={{
                fontFamily: "Baskerville",
                fontSize: 20,
                paddingHorizontal: 2,
              }}
            >
              {data.des}
            </Text>

            <View className="flex-row justify-center items-center mb-3">
              <View className="rounded-full bg-[#69DC9E] w-10 h-10 justify-center items-center mr-3">
                <Text className="text-white text-lg">9.5</Text>
              </View>

              <Text className="text-slate-600 ">{data?.price}</Text>
              <Text className=" font-bold">{data?.open_now_text}</Text>
            </View>
          </View>
        </View>
        {/*  */}
        {/*  */}
        <ReviewsSections reviews={data?.reviews} ranking={data?.rating} />
        {/* hotel description */}

        <Description
          title={data?.title}
          type={data?.type}
          subDes={data?.subDes}
        />
        <LocationSection
          long={data?.long}
          lat={data?.lat}
          location={data?.location}
        />
        <TodoList />
      </ScrollView>

      <View className="h-24 w-full flex-row justify-between bg-white items-center border-slate-300 border-t-[1px] shadow-lxl">
        <View className=" ml-10">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-slate-600 font-semibold"
          >
            AVG Price
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-[#69DC9E] font-semibold"
          >
            $399.99
          </Text>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 20 }}
            className="text-slate-600 font-semibold "
          >
            Person/Night
          </Text>
        </View>
        <View>
          <TouchableOpacity className="p-3 bg-[#69DC9E] rounded-lg mr-10">
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 20 }}
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
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    color: "#599EA4",
    justifyContent: "center",
    marginLeft: 40,

    display: "flex",
    flexDirection: "row",
    width: 100,
    height: 50,
  },
  text: {
    color: "#599EA4",

    fontSize: 30,
  },
  subText: {
    color: "#000",
    backgroundColor: "#fff",
    fontSize: 30,
  },
});
export default Dummy;
