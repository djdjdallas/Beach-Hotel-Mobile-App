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
import MenuContainer from "../components/MenuContainer";
import { getPlacesData } from "../api/Index";
import SearchResults from "../components/SearchResults";
import EnhancedSearchResults from "../components/EnhancedSearchResults";
import PromoCard from "./PromoCard";
import axios from "axios";
import Index from "../api/Index";
import Config from "react-native-config";
import EnhancedSearch from "../components/EnhancedSearch";
import SearchFilters from "../components/SearchFilters";
import LocationRecommendations from "../components/LocationRecommendations";
import locationService from "../services/locationService";
import searchService from "../services/searchService";
import travelService from "../services/travel.service";
const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mainData, setmainData] = useState([]);
  const [bl_lat, setBl_lat] = useState({});
  const [bl_lng, setBl_lng] = useState({});
  const [tr_lat, setTr_lat] = useState({});
  const [tr_lng, setTr_lng] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    priceLevel: [],
    openNow: false,
    maxDistance: 10,
    sortBy: 'relevance',
  });
  const [userLocation, setUserLocation] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const icon1 = <Icon name="house" type="material" color="#69DC9E" size={40} />;
  const icon2 = (
    <Icon name="location-on" type="material" color="#69DC9E" size={40} />
  );
  const icon3 = (
    <Icon name="dinner-dining" type="material" color="#69DC9E" size={40} />
  );

  const navigation = useNavigation();
  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  useEffect(() => {
    getUserLocation();
  }, []);

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
      console.log('Location permission not granted or error:', error);
    }
  };

  useEffect(() => {
    let timeoutId;
    let isMounted = true;
    
    const fetchData = async () => {
      if (!type) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type);
        
        if (isMounted) {
          setmainData(data || []);
          // Use setTimeout instead of setInterval and store the timeout ID
          timeoutId = setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          }, 2000);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch data');
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [bl_lat, bl_lng, tr_lat, tr_lng, type]);

  useEffect(() => {
    // Apply filters and sorting when data or filters change
    if (mainData && mainData.length > 0) {
      let processed = [...mainData];
      
      // Apply filters
      processed = searchService.applyFilters(processed, {
        ...filters,
        userLocation,
      });
      
      // Apply sorting
      processed = searchService.sortResults(processed, filters.sortBy, userLocation);
      
      setFilteredData(processed);
    } else {
      setFilteredData([]);
    }
  }, [mainData, filters, userLocation]);

  return (
    <SafeAreaView className="h-screen bg-white">
      <View className="h-screen">
        <View className="mt-2 ml-3 p-2 bg-white">
          <Text
            style={{ fontFamily: "Baskerville" }}
            className="text-[#0C0C0C] text-3xl font-bold"
          >
            Discover your
          </Text>
          <Text
            style={{ fontFamily: "Baskerville" }}
            className="text-[#69DC9E] text-3xl font-light"
          >
            next favorite place ..
          </Text>
        </View>

        {/* menu */}
        <View className="flex justify-center items-center mt-2 h-40">
          <View className="bg-slate-100 p-3 rounded-lg w-80 ">
            <View className="flex-row space-x-2 rounded-md ">
              <EnhancedSearch
                placeholder="Search for a place..."
                onLocationSelected={(data, details, searchData) => {
                  console.log("Location selected:", data, details, searchData);
                  setSearchQuery(data.description);
                  setBl_lat(details?.geometry?.viewport?.southwest?.lat);
                  setBl_lng(details?.geometry?.viewport?.southwest?.lng);
                  setTr_lat(details?.geometry?.viewport?.northeast?.lat);
                  setTr_lng(details?.geometry?.viewport?.northeast?.lng);
                  
                  // Navigate to hotel search if Hotels tab is selected
                  if (type === 'hotels' && searchData) {
                    navigation.navigate('HotelSearch', {
                      location: searchData,
                      checkIn: new Date().toISOString().split('T')[0],
                      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                      guests: { adults: 1, children: 0, rooms: 1 }
                    });
                  }
                }}
                showRecentSearches={true}
                showCurrentLocation={true}
              />
            </View>

            <View className="flex-row">
              <MenuContainer
                key={"hotels"}
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
                title="Restaurants"
                type={type}
                setType={setType}
                icon={icon3}
              />
            </View>
          </View>
        </View>

        {/* Filters Button */}
        {type && (
          <View className="flex-row justify-between items-center px-4 mb-2">
            <Text className="text-gray-600">
              {filteredData.length} results {searchQuery ? `for "${searchQuery}"` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
            >
              <Icon name="filter-list" type="material" color="#69DC9E" size={20} />
              <Text className="ml-1 text-gray-700">Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Location-based recommendations */}
        {type && userLocation && (
          <LocationRecommendations
            type={type}
            onSelectRecommendation={(bounds) => {
              setBl_lat(bounds.bl_lat);
              setBl_lng(bounds.bl_lng);
              setTr_lat(bounds.tr_lat);
              setTr_lng(bounds.tr_lng);
              if (bounds.selectedPlace) {
                setSearchQuery(bounds.selectedPlace.name);
              }
            }}
          />
        )}
        {error ? (
          <View className="flex-1 justify-center items-center w-full p-4">
            <Text className="text-red-500 text-center mb-4">{error}</Text>
            <TouchableOpacity 
              onPress={() => {
                setError(null);
                // Trigger re-fetch by resetting type
                const currentType = type;
                setType('');
                setTimeout(() => setType(currentType), 100);
              }}
              className="bg-[#69DC9E] px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <View className="flex-1 justify-center items-center w-full">
            <ActivityIndicator size="large" color="#69DC9E" />
          </View>
        ) : filteredData && filteredData.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 100,
              paddingVertical: 10,
            }}
            vertical
            showsVerticalScrollIndicator={false}
            className=""
          >
            {filteredData.map((data, index) => (
              <EnhancedSearchResults
                key={index}
                index={index}
                data={data}
                title={data?.name}
                short_description={data?.description}
                imgUrl={
                  data?.photo?.images?.large?.url
                    ? data?.photo?.images?.large?.url
                    : data?.photo?.images?.medium?.url
                }
                description={data?.cuisine?.join(", ")}
                price={data?.price_level}
                rating={data?.rating}
                ranking={data?.ranking}
                reviews={data?.num_reviews}
                location={data?.location_string}
                type={type}
                lat={data?.latitude}
                long={data?.longitude}
                userLocation={userLocation}
              />
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            className="bg-white"
            contentContainerStyle={{
              paddingBottom: 50,
              paddingHorizontal: 10,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="ml-4 mb-2">
              <Text
                style={{
                  fontFamily: "Baskerville",
                  fontWeight: "bold",
                  fontSize: 30,
                }}
                className="text-2xl"
              >
                Promos Today
              </Text>
            </View>

            <PromoRow />
            <View className="pl-3 my-3">
              <Text
                style={{
                  fontFamily: "Baskerville",
                  fontWeight: "bold",
                  fontSize: 30,
                }}
                className="text-2xl"
              >
                Tours
              </Text>
            </View>
            <ToursRow />
            <View className="pl-3">
              <Text
                style={{
                  fontFamily: "Baskerville",
                  fontWeight: "bold",
                  fontSize: 30,
                }}
                className="text-2xl"
              >
                Future Events
              </Text>
            </View>
            <EventsRow />
          </ScrollView>
        )}

        {/* Search Filters Modal */}
        <SearchFilters
          visible={showFilters}
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
