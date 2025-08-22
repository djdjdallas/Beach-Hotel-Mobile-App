import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  BellIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  CogIcon,
} from 'react-native-heroicons/outline';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Profile',
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#000',
    });
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    const result = await updateUser(editedData);
    
    if (result.success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const menuItems = [
    {
      icon: BellIcon,
      title: 'Notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy & Security',
      onPress: () => navigation.navigate('Privacy'),
    },
    {
      icon: CogIcon,
      title: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'Help & Support',
      onPress: () => navigation.navigate('Support'),
    },
  ];

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Please login to view your profile</Text>
        <TouchableOpacity
          className="bg-[#69DC9E] px-6 py-3 rounded-lg mt-4"
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text className="text-white font-semibold">Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white px-6 py-8">
          <View className="items-center">
            {/* Avatar */}
            <View className="relative">
              <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center">
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} className="w-32 h-32 rounded-full" />
                ) : (
                  <UserIcon size={60} color="#6B7280" />
                )}
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 bg-[#69DC9E] p-3 rounded-full">
                <CameraIcon size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            {!isEditing ? (
              <View className="items-center mt-4">
                <Text className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </Text>
                <Text className="text-gray-600 mt-1">{user.email}</Text>
                <TouchableOpacity
                  className="flex-row items-center mt-4 bg-gray-100 px-4 py-2 rounded-full"
                  onPress={() => setIsEditing(true)}
                >
                  <PencilIcon size={16} color="#6B7280" />
                  <Text className="ml-2 text-gray-700">Edit Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-full mt-4">
                <View className="flex-row mb-3">
                  <TextInput
                    className="flex-1 bg-gray-100 px-4 py-3 rounded-lg mr-2"
                    placeholder="First Name"
                    value={editedData.firstName}
                    onChangeText={(value) => setEditedData(prev => ({ ...prev, firstName: value }))}
                  />
                  <TextInput
                    className="flex-1 bg-gray-100 px-4 py-3 rounded-lg ml-2"
                    placeholder="Last Name"
                    value={editedData.lastName}
                    onChangeText={(value) => setEditedData(prev => ({ ...prev, lastName: value }))}
                  />
                </View>
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-lg mb-3"
                  placeholder="Email"
                  value={editedData.email}
                  onChangeText={(value) => setEditedData(prev => ({ ...prev, email: value }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  className="bg-gray-100 px-4 py-3 rounded-lg mb-4"
                  placeholder="Phone Number"
                  value={editedData.phone}
                  onChangeText={(value) => setEditedData(prev => ({ ...prev, phone: value }))}
                  keyboardType="phone-pad"
                />
                <View className="flex-row">
                  <TouchableOpacity
                    className="flex-1 bg-gray-200 py-3 rounded-lg mr-2"
                    onPress={() => setIsEditing(false)}
                  >
                    <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-[#69DC9E] py-3 rounded-lg ml-2"
                    onPress={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-center text-white font-semibold">Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4 flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">12</Text>
            <Text className="text-gray-600">Trips</Text>
          </View>
          <View className="h-full w-[1px] bg-gray-200" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">48</Text>
            <Text className="text-gray-600">Reviews</Text>
          </View>
          <View className="h-full w-[1px] bg-gray-200" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">156</Text>
            <Text className="text-gray-600">Photos</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-6 bg-white mx-4 rounded-xl">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row items-center justify-between p-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onPress={item.onPress}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <item.icon size={20} color="#6B7280" />
                </View>
                <Text className="ml-3 text-gray-800 font-medium">{item.title}</Text>
              </View>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="mx-4 mt-6 mb-8 bg-red-50 rounded-xl p-4 flex-row items-center justify-center"
          onPress={handleLogout}
        >
          <ArrowRightOnRectangleIcon size={24} color="#EF4444" />
          <Text className="ml-2 text-red-600 font-semibold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;