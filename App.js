import "./global.css";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon, UserIcon, MagnifyingGlassIcon, HeartIcon } from "react-native-heroicons/outline";
import { HomeIcon as HomeIconSolid, UserIcon as UserIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";

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
import ToursPage from "./components/ToursPage";

// Auth
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Protected Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HomeTab') {
            return focused ? <HomeIconSolid size={size} color={color} /> : <HomeIcon size={size} color={color} />;
          } else if (route.name === 'Search') {
            return focused ? <MagnifyingGlassIconSolid size={size} color={color} /> : <MagnifyingGlassIcon size={size} color={color} />;
          } else if (route.name === 'Favorites') {
            return focused ? <HeartIconSolid size={size} color={color} /> : <HeartIcon size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return focused ? <UserIconSolid size={size} color={color} /> : <UserIcon size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#69DC9E',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={Home} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Favorites" component={Dummy} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Auth Screens */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          
          {/* Main App - Protected */}
          <Stack.Screen 
            name="Home" 
            options={{ headerShown: false }}
          >
            {() => (
              <ProtectedRoute>
                <TabNavigator />
              </ProtectedRoute>
            )}
          </Stack.Screen>
          
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
  );
}
