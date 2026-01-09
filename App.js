import 'react-native-get-random-values';
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon, UserIcon, MagnifyingGlassIcon, HeartIcon } from "react-native-heroicons/outline";
import { HomeIcon as HomeIconSolid, UserIcon as UserIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Screens
import Home from "./screens/Home";
import Login from "./screens/Login";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import PromoCard from "./screens/PromoCard";
import EventsPage from "./components/EventsPage";
import SearchPage from "./components/SearchPage";
import HotelPhotos from "./components/HotelPhotos";
import Dummy from "./screens/Dummy";
import Favorites from "./screens/Favorites";
import ToursPage from "./components/ToursPage";

// Auth
import { AuthProvider } from "./contexts/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Protected Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HomeTab') {
            return focused ? <HomeIconSolid size={24} color={color} /> : <HomeIcon size={24} color={color} />;
          } else if (route.name === 'Search') {
            return focused ? <MagnifyingGlassIconSolid size={24} color={color} /> : <MagnifyingGlassIcon size={24} color={color} />;
          } else if (route.name === 'Favorites') {
            return focused ? <HeartIconSolid size={24} color={color} /> : <HeartIcon size={24} color={color} />;
          } else if (route.name === 'Profile') {
            return focused ? <UserIconSolid size={24} color={color} /> : <UserIcon size={24} color={color} />;
          }
        },
        tabBarActiveTintColor: '#69DC9E',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={Home} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {/* Auth Screens */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            
            {/* Main App - Unprotected Tab Navigator */}
            <Stack.Screen 
              name="Home" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            
            {/* Other Screens */}
            <Stack.Screen name="EventsPage" component={EventsPage} />
            <Stack.Screen name="SearchPage" component={SearchPage} />
            <Stack.Screen name="PromoCard" component={PromoCard} />
            <Stack.Screen name="HotelPhotos" component={HotelPhotos} />
            <Stack.Screen name="Dummy" component={Dummy} />
            <Stack.Screen name="ToursPage" component={ToursPage} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
