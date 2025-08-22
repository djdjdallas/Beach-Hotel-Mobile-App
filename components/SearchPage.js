import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import EnhancedSearch from "./EnhancedSearch";
import EnhancedSearchResults from "./EnhancedSearchResults";
import SearchFilters from "./SearchFilters";
import LocationRecommendations from "./LocationRecommendations";
import MenuContainer from "./MenuContainer";
import { getPlacesData } from "../api/Index";
import searchService from "../services/searchService";
import locationService from "../services/locationService";

const SearchPage = ({ route }) => {
  const navigation = useNavigation();
  const initialData = route?.params?.param;
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [bl_lat, setBl_lat] = useState(initialData?.bl_lat || null);
  const [bl_lng, setBl_lng] = useState(initialData?.bl_lng || null);
  const [tr_lat, setTr_lat] = useState(initialData?.tr_lat || null);
  const [tr_lng, setTr_lng] = useState(initialData?.tr_lng || null);
  const [type, setType] = useState(initialData?.type || '');
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const [filters, setFilters] = useState({
    minRating: 0,
    priceLevel: [],
    openNow: false,
    maxDistance: 10,
    sortBy: 'relevance',
  });

  const icon1 = <Icon name="house" type="material" color="#69DC9E" size={40} />;
  const icon2 = <Icon name="location-on" type="material" color="#69DC9E" size={40} />;
  const icon3 = <Icon name="dinner-dining" type="material" color="#69DC9E" size={40} />;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Search',
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
        fontSize: 20,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }}
        >
          <Icon name="arrow-back" type="material" color="#333" size={24} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{ marginRight: 15 }}
        >
          <Icon 
            name={showFavoritesOnly ? "favorite" : "favorite-border"} 
            type="material" 
            color={showFavoritesOnly ? "#FF6B6B" : "#333"} 
            size={24} 
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showFavoritesOnly]);

  useEffect(() => {
    getUserLocation();
    loadFavorites();
    if (initialData && type) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (type && bl_lat && bl_lng && tr_lat && tr_lng) {
      fetchData();
    }
  }, [bl_lat, bl_lng, tr_lat, tr_lng, type]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchResults, filters, userLocation, showFavoritesOnly]);

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

  const loadFavorites = async () => {
    try {
      const favs = await searchService.getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const fetchData = async () => {
    if (!type) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type);
      setSearchResults(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const applyFiltersAndSort = () => {
    let processed = [...searchResults];
    
    if (showFavoritesOnly) {
      // Show only favorited items
      const favoriteIds = favorites.map(f => f.placeId);
      processed = processed.filter(item => {
        const placeId = item.place_id || `${item.latitude}-${item.longitude}`;
        return favoriteIds.includes(placeId);
      });
    }
    
    // Apply filters
    processed = searchService.applyFilters(processed, {
      ...filters,
      userLocation,
    });
    
    // Apply sorting
    processed = searchService.sortResults(processed, filters.sortBy, userLocation);
    
    setFilteredResults(processed);
  };

  const handleLocationSelected = (data, details) => {
    setSearchQuery(data.description);
    setBl_lat(details?.geometry?.viewport?.southwest?.lat);
    setBl_lng(details?.geometry?.viewport?.southwest?.lng);
    setTr_lat(details?.geometry?.viewport?.northeast?.lat);
    setTr_lng(details?.geometry?.viewport?.northeast?.lng);
  };

  const renderEmptyState = () => {
    if (showFavoritesOnly) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Icon name="favorite-border" type="material" color="#ccc" size={64} />
          <Text style={{ 
            fontSize: 18, 
            color: '#666', 
            marginTop: 16,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
          }}>
            No favorites yet
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: '#999', 
            marginTop: 8,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
          }}>
            Tap the heart icon on places you love to save them here
          </Text>
        </View>
      );
    }
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Icon name="search" type="material" color="#ccc" size={64} />
        <Text style={{ 
          fontSize: 18, 
          color: '#666', 
          marginTop: 16,
          textAlign: 'center',
          fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
        }}>
          {type ? 'No results found' : 'Start your search'}
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: '#999', 
          marginTop: 8,
          textAlign: 'center',
          fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
        }}>
          {type ? 'Try adjusting your filters or search area' : 'Search for a place and select a category'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        {/* Search Bar */}
        <View style={{ padding: 15 }}>
          <EnhancedSearch
            placeholder="Search for a place..."
            onLocationSelected={handleLocationSelected}
            showRecentSearches={true}
            showCurrentLocation={true}
          />
        </View>

        {/* Category Selection */}
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <MenuContainer
              key="hotels"
              title="Hotels"
              type={type}
              setType={setType}
              icon={icon1}
            />
            <MenuContainer
              key="attractions"
              title="Attractions"
              type={type}
              setType={setType}
              icon={icon2}
            />
            <MenuContainer
              key="restaurants"
              title="Restaurants"
              type={type}
              setType={setType}
              icon={icon3}
            />
          </View>
        </View>

        {/* Filters and Results Count */}
        {type && !showFavoritesOnly && (
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 15, 
            marginBottom: 10 
          }}>
            <Text style={{ color: '#666', fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif' }}>
              {filteredResults.length} results {searchQuery ? `for "${searchQuery}"` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: '#f5f5f5', 
                paddingHorizontal: 12, 
                paddingVertical: 8, 
                borderRadius: 8 
              }}
            >
              <Icon name="filter-list" type="material" color="#69DC9E" size={20} />
              <Text style={{ marginLeft: 4, color: '#333' }}>Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Location Recommendations */}
        {type && userLocation && !showFavoritesOnly && (
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

        {/* Results */}
        {error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Icon name="error-outline" type="material" color="#FF6B6B" size={48} />
            <Text style={{ 
              color: '#FF6B6B', 
              textAlign: 'center', 
              marginBottom: 16, 
              marginTop: 16,
              fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
            }}>
              {error}
            </Text>
            <TouchableOpacity 
              onPress={fetchData}
              style={{ 
                backgroundColor: '#69DC9E', 
                paddingHorizontal: 24, 
                paddingVertical: 12, 
                borderRadius: 8 
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#69DC9E" />
            <Text style={{ 
              marginTop: 16, 
              color: '#666',
              fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
            }}>
              Loading {type}...
            </Text>
          </View>
        ) : filteredResults.length > 0 ? (
          <FlatList
            data={filteredResults}
            keyExtractor={(item, index) => `${item.location_id || index}`}
            renderItem={({ item, index }) => (
              <EnhancedSearchResults
                index={index}
                data={item}
                title={item?.name}
                short_description={item?.description}
                imgUrl={
                  item?.photo?.images?.large?.url ||
                  item?.photo?.images?.medium?.url
                }
                description={item?.cuisine?.join(", ")}
                price={item?.price_level}
                rating={item?.rating}
                ranking={item?.ranking}
                reviews={item?.num_reviews}
                location={item?.location_string}
                type={type}
                lat={item?.latitude}
                long={item?.longitude}
                userLocation={userLocation}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#69DC9E']}
                tintColor="#69DC9E"
              />
            }
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
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

export default SearchPage;
