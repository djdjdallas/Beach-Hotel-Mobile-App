import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import { 
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from "react-native-heroicons/solid";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from 'expo-linear-gradient';
import locationService from "../services/locationService";
import { usePopularDestinations, useCategories, useSearch } from "../hooks/useApi";
import apiService from "../services/apiService";

const Home = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('hotels');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState([]);
  
  // Use API hooks
  const { data: categoriesData, loading: categoriesLoading } = useCategories();
  const { data: destinationsData, loading: destinationsLoading } = usePopularDestinations();
  const { results: searchResults, loading: searchLoading, search: performSearch } = useSearch(selectedCategory);
  
  // Use API data with fallback
  const categories = categoriesData || [
    { id: 'hotels', name: 'Hotels', icon: '🏨' },
    { id: 'restaurants', name: 'Restaurants', icon: '🍽️' },
    { id: 'attractions', name: 'Attractions', icon: '🎭' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  ];

  const popularDestinations = (destinationsData || [
    { id: 1, name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', deals: 234 },
    { id: 2, name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', deals: 189 },
    { id: 3, name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', deals: 302 },
    { id: 4, name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400', deals: 156 },
  ]).map(dest => ({
    ...dest,
    deals: typeof dest.deals === 'number' ? `${dest.deals} deals` : dest.deals
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    getUserLocation();
    loadInitialData();
  }, [selectedCategory]);
  
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setPlaces(searchResults);
    }
  }, [searchResults]);

  const getUserLocation = async () => {
    try {
      const hasPermission = await locationService.checkPermissions();
      if (hasPermission) {
        const location = await locationService.getCurrentLocation();
        setUserLocation({
          lat: location.latitude,
          lng: location.longitude,
        });
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Get location-based recommendations if we have user location
      let params = { category: selectedCategory };
      if (userLocation) {
        params.latitude = userLocation.lat;
        params.longitude = userLocation.lng;
      }
      
      const data = await performSearch(params);
      if (!data || data.length === 0) {
        // Fallback to demo data if API fails
        setPlaces(getDemoData());
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to demo data
      setPlaces(getDemoData());
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [selectedCategory, userLocation]);

  const getDemoData = () => {
    const demoPlaces = {
      hotels: [
        {
          id: '1',
          name: 'Grand Royal Hotel',
          rating: 4.8,
          reviews: 2341,
          price: '$299',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          distance: '0.8 km',
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
        },
        {
          id: '2',
          name: 'Sunset Beach Resort',
          rating: 4.5,
          reviews: 1856,
          price: '$199',
          image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
          distance: '2.1 km',
          amenities: ['Beach', 'Pool', 'Bar', 'WiFi'],
        },
        {
          id: '3',
          name: 'Mountain View Lodge',
          rating: 4.6,
          reviews: 923,
          price: '$159',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          distance: '5.3 km',
          amenities: ['Mountain View', 'Fireplace', 'Restaurant'],
        },
      ],
      restaurants: [
        {
          id: '4',
          name: 'The Golden Fork',
          rating: 4.7,
          reviews: 1542,
          price: '$$',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          distance: '0.5 km',
          cuisine: 'Italian',
          openNow: true,
        },
        {
          id: '5',
          name: 'Sushi Paradise',
          rating: 4.9,
          reviews: 2103,
          price: '$$$',
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
          distance: '1.2 km',
          cuisine: 'Japanese',
          openNow: true,
        },
        {
          id: '6',
          name: 'Burger House',
          rating: 4.4,
          reviews: 892,
          price: '$',
          image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
          distance: '0.9 km',
          cuisine: 'American',
          openNow: false,
        },
      ],
      attractions: [
        {
          id: '7',
          name: 'City Museum',
          rating: 4.6,
          reviews: 3421,
          price: '$25',
          image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=400',
          distance: '1.5 km',
          type: 'Museum',
          openNow: true,
        },
        {
          id: '8',
          name: 'Central Park',
          rating: 4.8,
          reviews: 5634,
          price: 'Free',
          image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400',
          distance: '2.0 km',
          type: 'Park',
          openNow: true,
        },
      ],
      shopping: [
        {
          id: '9',
          name: 'Downtown Mall',
          rating: 4.3,
          reviews: 1823,
          price: null,
          image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400',
          distance: '3.2 km',
          type: 'Shopping Mall',
          openNow: true,
        },
      ],
    };
    return demoPlaces[selectedCategory] || [];
  };

  const toggleFavorite = async (item) => {
    try {
      if (favorites.includes(item.id)) {
        await apiService.removeFavorite(item.id);
        setFavorites(prev => prev.filter(fav => fav !== item.id));
      } else {
        await apiService.addFavorite(item);
        setFavorites(prev => [...prev, item.id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Fallback to local state update
      setFavorites(prev => 
        prev.includes(item.id) 
          ? prev.filter(fav => fav !== item.id)
          : [...prev, item.id]
      );
    }
  };

  const renderHeader = () => (
    <View className="bg-white">
      {/* Welcome Section */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-gray-500 text-sm">Good morning</Text>
        <Text className="text-gray-900 text-2xl font-bold mt-1">
          Where are you going?
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
          <MagnifyingGlassIcon size={22} color="#9CA3AF" />
          <TextInput
            placeholder="Search destinations..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => {
              if (searchText.trim()) {
                performSearch({ query: searchText, category: selectedCategory });
              }
            }}
            returnKeyType="search"
          />
          <TouchableOpacity>
            <AdjustmentsHorizontalIcon size={22} color="#69DC9E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-5 mb-4"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              setSelectedCategory(category.id);
            }}
            className={`mr-3 px-5 py-3 rounded-2xl flex-row items-center ${
              selectedCategory === category.id 
                ? 'bg-[#69DC9E]' 
                : 'bg-gray-100'
            }`}
          >
            <Text className="text-2xl mr-2">{category.icon}</Text>
            <Text 
              className={`font-medium ${
                selectedCategory === category.id 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popular Destinations */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center px-5 mb-3">
          <Text className="text-gray-900 text-lg font-bold">
            Popular Destinations
          </Text>
          <TouchableOpacity>
            <Text className="text-[#69DC9E] font-medium">See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-5"
        >
          {popularDestinations.map((destination) => (
            <TouchableOpacity 
              key={destination.id}
              className="mr-3"
              onPress={() => console.log('Navigate to', destination.name)}
            >
              <View className="relative">
                <Image 
                  source={{ uri: destination.image }}
                  className="w-32 h-40 rounded-2xl"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  className="absolute bottom-0 w-32 h-20 rounded-b-2xl"
                />
                <View className="absolute bottom-3 left-3">
                  <Text className="text-white font-bold">{destination.name}</Text>
                  <Text className="text-white text-xs opacity-90">{destination.deals}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section Title */}
      <View className="px-5 mb-3">
        <Text className="text-gray-900 text-lg font-bold">
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Near You
        </Text>
      </View>
    </View>
  );

  const renderPlace = ({ item }) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={600}
      className="mx-5 mb-4"
    >
      <TouchableOpacity 
        className="bg-white rounded-2xl shadow-sm"
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PromoCard', { data: item })}
      >
        <Image 
          source={{ uri: item.image }}
          className="w-full h-48 rounded-t-2xl"
        />
        
        {/* Favorite Button */}
        <TouchableOpacity 
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full"
          onPress={() => toggleFavorite(item)}
        >
          {favorites.includes(item.id) ? (
            <HeartIconSolid size={20} color="#EF4444" />
          ) : (
            <HeartIcon size={20} color="#6B7280" />
          )}
        </TouchableOpacity>

        <View className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="text-gray-900 text-lg font-bold" numberOfLines={1}>
                {item.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <MapPinIcon size={14} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-1">{item.distance}</Text>
                {item.openNow !== undefined && (
                  <>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <ClockIcon size={14} color={item.openNow ? '#10B981' : '#EF4444'} />
                    <Text className={`text-sm ml-1 ${item.openNow ? 'text-green-600' : 'text-red-600'}`}>
                      {item.openNow ? 'Open' : 'Closed'}
                    </Text>
                  </>
                )}
              </View>
            </View>
            {item.price && (
              <Text className="text-[#69DC9E] text-xl font-bold">
                {typeof item.price === 'number' ? `$${item.price}` : item.price}
              </Text>
            )}
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <StarIconSolid size={16} color="#FFC107" />
              <Text className="text-gray-700 font-medium ml-1">{item.rating}</Text>
              <Text className="text-gray-500 text-sm ml-1">({item.reviews})</Text>
            </View>
            
            {item.cuisine && (
              <Text className="text-gray-600 text-sm">{item.cuisine}</Text>
            )}
            
            {item.type && (
              <Text className="text-gray-600 text-sm">{item.type}</Text>
            )}
          </View>

          {item.amenities && (
            <View className="flex-row flex-wrap mt-3 -mx-1">
              {item.amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} className="bg-gray-100 px-3 py-1 rounded-full m-1">
                  <Text className="text-gray-600 text-xs">{amenity}</Text>
                </View>
              ))}
              {item.amenities.length > 3 && (
                <View className="bg-gray-100 px-3 py-1 rounded-full m-1">
                  <Text className="text-gray-600 text-xs">+{item.amenities.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-6xl mb-4">🔍</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        No {selectedCategory} found
      </Text>
      <Text className="text-gray-600 text-center px-10">
        Try adjusting your search or filters to find what you're looking for
      </Text>
      <TouchableOpacity 
        className="bg-[#69DC9E] px-6 py-3 rounded-full mt-6"
        onPress={onRefresh}
      >
        <Text className="text-white font-semibold">Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {(isLoading || searchLoading || categoriesLoading) ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#69DC9E" />
          <Text className="text-gray-600 mt-4">Discovering amazing places...</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          renderItem={renderPlace}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#69DC9E"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: Platform.OS === 'ios' ? 90 : 70 
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;