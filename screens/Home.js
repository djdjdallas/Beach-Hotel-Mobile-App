import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import PromoRow from "../components/PromoRow";
import ToursRow from "../components/ToursRow";
import EventsRow from "../components/EventsRow";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MenuContainer from "../components/MenuContainer";
import { getPlacesData } from "../api/Index";
import SearchResults from "../components/SearchResults";
import PromoCard from "./PromoCard";
import axios from "axios";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainData, setmainData] = useState();
  const icon1 = <Icon name="house" type="material" color="#00aced" size={32} />;
  const icon2 = (
    <Icon name="location-on" type="material" color="#00aced" size={32} />
  );
  const icon3 = (
    <Icon name="dinner-dining" type="material" color="#00aced" size={32} />
  );
  const icon4 = (
    <Icon name="flight-takeoff" type="material" color="#00aced" size={32} />
  );
  const navigation = useNavigation();
  const [type, setType] = useState("restaurants");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    setIsLoading(true);
    getPlacesData().then((data) => {
      setmainData(data);
      setInterval(() => {
        setIsLoading(false);
      }, 5000);
    });
  }, []);

  return (
    <SafeAreaView>
      <View className="bg-white h-screen">
        <ImageBackground
          source={require("../assets/home-hero.jpg")}
          className="w-screen h-52"
        />
        <View className="flex justify-center items-center translate-y-[-40px] shadow-md ">
          <View className="bg-white w-90 p-3 rounded-lg">
            <View className="flex-row justify-center space-x-4 p-3 rounded-md bg-slate-200">
              <GooglePlacesAutocomplete
                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                placeholder="Search"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log("data", data);
                  console.log("details", details);
                  console.log(JSON.stringify(details?.geometry?.viewport));
                }}
                query={{
                  key: "AIzaSyDVFg0u1SSZQMezHtqoUmWcloI6s3OrRYY",
                  language: "en",
                }}
              />
            </View>

            <View className="flex-row">
              <MenuContainer
                key={"hotel"}
                title="Hotels"
                type={type}
                setType={setType}
                icon={icon1}
              />
              <MenuContainer
                key={"attractions"}
                title="Attractions"
                type={type}
                setType={setType}
                icon={icon2}
              />
              <MenuContainer
                key={"restaurants"}
                title="Restaurant"
                type={type}
                setType={setType}
                icon={icon3}
              />
              <MenuContainer
                key={"flights"}
                title="Flight"
                type={type}
                setType={setType}
                icon={icon4}
              />
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          horizontal
          className="h-60"
        >
          {mainData?.map((data, index) => (
            <SearchResults
              key={index}
              data={data}
              title={data?.name}
              imgUrl={data?.photo?.images?.medium?.url}
              description={data?.cuisine?.join(", ")}
              price={data?.price_level}
              rating={data?.rating}
              reviews={data?.num_reviews}
              location={data?.location_string}
            />
          ))}
        </ScrollView>
        {!mainData ? (
          <ScrollView
            className="bg-white"
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
            <View className="p-3">
              <Text className="text-2xl">Promos Today</Text>
            </View>

            <PromoRow />
            <View className="pl-3">
              <Text className="text-2xl">Tours</Text>
            </View>
            <ToursRow />
            <View className="pl-3">
              <Text className="text-2xl">Future Events</Text>
            </View>
            <EventsRow />
          </ScrollView>
        ) : null}
      </View>

      <View className=" h-16 flex-row justify-around my-2">
        <TouchableOpacity>
          <View className=" border-gray-400">
            <Icon name="house" type="material" color="#517fa4" size={32} />
            <Text className="text-md">Home</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Icon name="bookmark" type="material" color="#517fa4" size={32} />
            <Text className="text-md">Booking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Icon
              name="account-circle"
              type="material"
              color="#517fa4"
              size={32}
            />
            <Text className="text-md">Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
