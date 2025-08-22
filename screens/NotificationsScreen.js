import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

const NotificationsScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Notifications',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">No Notifications</Text>
        <Text className="text-gray-600 text-center">
          You don't have any notifications at the moment. We'll notify you when something important happens.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;