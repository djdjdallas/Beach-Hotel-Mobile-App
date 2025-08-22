import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  BellIcon,
  GlobeAltIcon,
  MoonIcon,
  ShieldCheckIcon,
  TrashIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      promotional: true,
    },
    privacy: {
      shareData: false,
      showProfile: true,
    },
    preferences: {
      darkMode: false,
      language: 'English',
      currency: 'USD',
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Settings',
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
    
    loadSettings();
  }, [navigation]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    
    setSettings(newSettings);
    
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.deleteAccount();
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon: Icon, title, value, onPress, hasToggle, isToggled, onToggle }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4 border-b border-gray-100"
      onPress={onPress}
      disabled={hasToggle}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
          <Icon size={20} color="#6B7280" />
        </View>
        <Text className="text-gray-800 text-base flex-1">{title}</Text>
      </View>
      {hasToggle ? (
        <Switch
          value={isToggled}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#69DC9E' }}
          thumbColor="#fff"
        />
      ) : (
        <View className="flex-row items-center">
          {value && <Text className="text-gray-500 mr-2">{value}</Text>}
          <ChevronRightIcon size={20} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Notifications</Text>
          
          <SettingItem
            icon={BellIcon}
            title="Push Notifications"
            hasToggle
            isToggled={settings.notifications.push}
            onToggle={(value) => updateSetting('notifications', 'push', value)}
          />
          
          <SettingItem
            icon={BellIcon}
            title="Email Notifications"
            hasToggle
            isToggled={settings.notifications.email}
            onToggle={(value) => updateSetting('notifications', 'email', value)}
          />
          
          <SettingItem
            icon={BellIcon}
            title="SMS Notifications"
            hasToggle
            isToggled={settings.notifications.sms}
            onToggle={(value) => updateSetting('notifications', 'sms', value)}
          />
          
          <View className="py-4">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <BellIcon size={20} color="#6B7280" />
              </View>
              <Text className="text-gray-800 text-base flex-1">Promotional Emails</Text>
            </View>
            <View className="ml-13">
              <Switch
                value={settings.notifications.promotional}
                onValueChange={(value) => updateSetting('notifications', 'promotional', value)}
                trackColor={{ false: '#E5E7EB', true: '#69DC9E' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Preferences</Text>
          
          <SettingItem
            icon={MoonIcon}
            title="Dark Mode"
            hasToggle
            isToggled={settings.preferences.darkMode}
            onToggle={(value) => updateSetting('preferences', 'darkMode', value)}
          />
          
          <SettingItem
            icon={GlobeAltIcon}
            title="Language"
            value={settings.preferences.language}
            onPress={() => navigation.navigate('LanguageSettings')}
          />
          
          <SettingItem
            icon={GlobeAltIcon}
            title="Currency"
            value={settings.preferences.currency}
            onPress={() => navigation.navigate('CurrencySettings')}
          />
        </View>

        {/* Privacy Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Privacy</Text>
          
          <SettingItem
            icon={ShieldCheckIcon}
            title="Share Usage Data"
            hasToggle
            isToggled={settings.privacy.shareData}
            onToggle={(value) => updateSetting('privacy', 'shareData', value)}
          />
          
          <SettingItem
            icon={ShieldCheckIcon}
            title="Public Profile"
            hasToggle
            isToggled={settings.privacy.showProfile}
            onToggle={(value) => updateSetting('privacy', 'showProfile', value)}
          />
          
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <ShieldCheckIcon size={20} color="#6B7280" />
              </View>
              <Text className="text-gray-800 text-base">Change Password</Text>
            </View>
            <ChevronRightIcon size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View className="bg-white mx-4 mt-4 mb-8 rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Account</Text>
          
          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={handleDeleteAccount}
          >
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
              <TrashIcon size={20} color="#EF4444" />
            </View>
            <Text className="text-red-600 text-base">Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="px-4 pb-8">
          <Text className="text-center text-gray-500 text-sm">Roamly v1.0.0</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
            <Text className="text-center text-[#69DC9E] text-sm mt-2">Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
            <Text className="text-center text-[#69DC9E] text-sm mt-1">Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;