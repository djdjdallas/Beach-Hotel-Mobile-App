import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import ToursPage from "../components/ToursPage";
import ReviewsSections from "../components/ReviewsSections";
import SearchResults from "../components/SearchResults";
import Description from "../components/Description";
import LocationSection from "../components/LocationSection";
import TodoList from "../components/TodoList";
const PromoCard = ({ route }) => {
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
        {data?.type == "hotels" ? (
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
        ) : null}

        {/* title and short description section */}
        <View className="justify-center items-center ">
          <View className="flex-col items-center justify-between mt-4 h-36 w-96 bg-white rounded-2xl shadow-xl border-[1px] border-slate-300">
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 25 }}
              className="text-2xl my-1"
            >
              {data?.title}
            </Text>
            <Text
              style={{ fontFamily: "Baskerville", fontSize: 22 }}
              className="text-slate-600 text-lg"
            >
              {data?.ranking}
            </Text>

            <View className="flex-row justify-center items-center mb-3">
              <View className="rounded-full bg-[#69DC9E] w-10 h-10 justify-center items-center mr-3">
                <Text className="text-white text-lg">{data?.rating}</Text>
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

        <Description title={data?.title} type={data?.type} />
        <LocationSection
          long={data?.long}
          lat={data?.lat}
          location={data?.location}
        />
        <TodoList />
      </ScrollView>
      {data?.type == "hotels" ? (
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
      ) : null}
    </>
  );
};

export default PromoCard;
