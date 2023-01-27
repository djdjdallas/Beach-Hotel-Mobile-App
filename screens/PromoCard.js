import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
const PromoCard = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.param;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView classname="relative">
      <ScrollView classname=" px-4 py-6">
        <TouchableOpacity>
          <View classname="bg-black shadow-lg w-full">
            <Image
              source={{
                uri: data?.photo?.images?.original?.url
                  ? data?.photo?.images?.original?.url
                  : data?.photo?.images?.small?.url,
              }}
              classname=" w-full rounded-2xl bg-black"
            />
            <View classname="absolute flex-row inset-x-0 top-5 justify-between px-6">
              <TouchableOpacity
                className="mr-3"
                onPress={() =>
                  navigation.navigate("Home", {
                    param: data,
                  })
                }
              >
                <Icon
                  type="material"
                  size={32}
                  name="arrow-back"
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View classname="flex-col items-center justify-between mt-4 h-10 w-full">
            <Text classname="text-black">{data?.price_level}</Text>
            <Text classname="text-black">{data?.price}</Text>
            <Text classname="text-black font-bold">{data?.open_now_text}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PromoCard;
