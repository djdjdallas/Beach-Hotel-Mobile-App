import { View, Text, SafeAreaView, Image, StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import NewPage from "../components/EventsPage";
import * as Animatable from "react-native-animatable";
const Login = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView className=" bg-white">
      <View className="flex-row mt-2 ml-3 items-center bg-white">
        <View className=" bg-[#0c0c0c] h-32 w-32 rounded-full justify-center items-center">
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 40 }}
            className="font-bold text-[#69DC9E] text-4xl p-1"
          >
            Roam
          </Text>
        </View>
        <View>
          <Text
            style={{ fontFamily: "Baskerville", fontSize: 40 }}
            className="ml-1 text-[#000000] text-4xl font-semibold translate-x-[-2px] font"
          >
            ly
          </Text>
        </View>
      </View>
      <View className="mt-6 ml-4 items-start bg-white">
        <Text
          style={{ fontFamily: "Baskerville" }}
          className="text-4xl mb-2 text-[#0c0c0c]"
        >
          Explore the world,
        </Text>
        <Text
          style={{ fontFamily: "Baskerville" }}
          className="text-4xl text-[#69DC9E]"
        >
          Roamly your way.
        </Text>
      </View>
      <View className="mt-3 ml-4 items-center bg-white">
        <Text
          style={{ fontFamily: "Baskerville", fontSize: 18 }}
          className="text-lg  text-[#0c0c0c] pr-2"
        >
          Simplify your travels with our all-in-one travel app. Find hotels,
          events & discover local hotspots. Start your next adventure with ease.
        </Text>
      </View>
      {/* circle section */}

      <View className="bg-white h-screen mt-5 translate-x-[-5px]">
        <View className=" bg-white justify-center items-center">
          <Animatable.Image
            animation="fadeIn"
            easing="ease-in-out"
            source={require("../assets/roamly.png")}
            className="w-80 h-96 bg-white"
          />
          <TouchableOpacity
            className="absolute bottom-10 translate-x-2 transform transition ease-in-out"
            onPress={() => {
              navigation.navigate("LoginScreen");
            }}
          >
            <Animatable.View
              animation={"pulse"}
              easing="ease-in-out"
              iterationCount="infinite"
              className="w-28 h-28 rounded-full border-r-2 border-l-2 border-t-4 border-green-500 items-center justify-center "
            >
              <View className="w-24 h-24 justify-center items-center rounded-full bg-[#69DC9E]">
                <Text
                  style={{ fontFamily: "Baskerville" }}
                  className="text-[#FFFFFF] text-2xl font-semibold"
                >
                  Roam
                </Text>
              </View>
            </Animatable.View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    backgroundColor: "#000",
    fontSize: 30,
  },
  subText: {
    color: "#000",
    backgroundColor: "#fff",
    fontSize: 30,
  },
});

export default Login;
