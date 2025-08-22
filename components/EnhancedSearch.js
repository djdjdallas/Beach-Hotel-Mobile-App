import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import searchService from '../services/searchService';
import locationService from '../services/locationService';
import travelService from '../services/travel.service';

const EnhancedSearch = ({ 
  onLocationSelected, 
  placeholder = "Search for a place...",
  showRecentSearches = true,
  showCurrentLocation = true,
  autoFocus = false,
}) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const googlePlacesRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadRecentSearches();
    checkLocationPermission();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await searchService.getRecentSearches();
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const checkLocationPermission = async () => {
    const hasPermission = await locationService.checkPermissions();
    setHasLocationPermission(hasPermission);
  };

  const handleLocationSelected = async (data, details) => {
    try {
      const searchData = {
        placeId: data.place_id,
        mainText: data.structured_formatting?.main_text || data.description,
        secondaryText: data.structured_formatting?.secondary_text || '',
        description: data.description,
        location: {
          lat: details?.geometry?.location?.lat,
          lng: details?.geometry?.location?.lng,
        },
        viewport: details?.geometry?.viewport,
      };

      // Search for destination ID from Booking.com
      try {
        const destinations = await travelService.searchDestinations(searchData.mainText);
        if (destinations && destinations.length > 0) {
          searchData.destId = destinations[0].id;
          searchData.destType = destinations[0].type;
          searchData.cityCode = destinations[0].cityCode;
        }
      } catch (error) {
        console.log('Could not fetch destination info:', error);
      }

      // Add to recent searches
      await searchService.addRecentSearch(searchData);
      
      // Call parent callback
      if (onLocationSelected) {
        onLocationSelected(data, details, searchData);
      }

      // Clear the search
      googlePlacesRef.current?.setAddressText('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error handling location selection:', error);
    }
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    try {
      // Request permissions if not granted
      if (!hasLocationPermission) {
        const granted = await locationService.requestPermissions();
        if (!granted) {
          alert('Location permission is required to use this feature');
          setIsLoading(false);
          return;
        }
        setHasLocationPermission(true);
      }

      const location = await locationService.getCurrentLocation();
      const address = await locationService.reverseGeocode(
        location.latitude,
        location.longitude
      );

      const currentLocationData = {
        description: address?.formattedAddress || 'Current Location',
        geometry: {
          location: {
            lat: location.latitude,
            lng: location.longitude,
          },
        },
      };

      if (onLocationSelected) {
        onLocationSelected(currentLocationData, {
          geometry: {
            location: {
              lat: location.latitude,
              lng: location.longitude,
            },
            viewport: {
              northeast: {
                lat: location.latitude + 0.01,
                lng: location.longitude + 0.01,
              },
              southwest: {
                lat: location.latitude - 0.01,
                lng: location.longitude - 0.01,
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Unable to get your current location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearchPress = (search) => {
    if (onLocationSelected) {
      onLocationSelected(
        { description: search.description, place_id: search.placeId },
        {
          geometry: {
            location: search.location,
            viewport: search.viewport,
          },
        }
      );
    }
  };

  const clearRecentSearches = async () => {
    try {
      await searchService.clearRecentSearches();
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const renderRecentSearches = () => {
    if (!showRecentSearches || recentSearches.length === 0) return null;

    return (
      <View style={styles.recentSearchesContainer}>
        <View style={styles.recentSearchesHeader}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          <TouchableOpacity onPress={clearRecentSearches}>
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        </View>
        {recentSearches.slice(0, 3).map((search, index) => (
          <TouchableOpacity
            key={search.placeId + index}
            style={styles.recentSearchItem}
            onPress={() => handleRecentSearchPress(search)}
          >
            <Icon
              name="history"
              type="material"
              color="#666"
              size={20}
              style={styles.recentSearchIcon}
            />
            <View style={styles.recentSearchText}>
              <Text style={styles.recentSearchMain}>{search.mainText}</Text>
              {search.secondaryText ? (
                <Text style={styles.recentSearchSecondary}>{search.secondaryText}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder={placeholder}
        fetchDetails={true}
        onPress={handleLocationSelected}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY,
          language: 'en',
          components: 'country:us', // Limit to US, adjust as needed
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
          description: styles.description,
          separator: styles.separator,
          loader: styles.loader,
          poweredContainer: styles.poweredContainer,
        }}
        enablePoweredByContainer={false}
        minLength={2}
        autoFocus={autoFocus}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
        renderLeftButton={() => (
          <Icon
            name="search"
            type="material"
            color="#69DC9E"
            size={24}
            style={styles.searchIcon}
          />
        )}
        renderRightButton={() => (
          showCurrentLocation && (
            <TouchableOpacity
              onPress={handleCurrentLocation}
              style={styles.locationButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#69DC9E" />
              ) : (
                <Icon
                  name="my-location"
                  type="material"
                  color="#69DC9E"
                  size={24}
                />
              )}
            </TouchableOpacity>
          )
        )}
        listEmptyComponent={renderRecentSearches()}
        GooglePlacesDetailsQuery={{
          fields: ['geometry', 'formatted_address', 'name'],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autocompleteContainer: {
    flex: 1,
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 50,
    color: '#5d5d5d',
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 45,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  listView: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  row: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    minHeight: 44,
    flexDirection: 'row',
  },
  description: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#e0e0e0',
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  poweredContainer: {
    display: 'none',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 13,
    zIndex: 2,
  },
  locationButton: {
    position: 'absolute',
    right: 15,
    top: 13,
    zIndex: 2,
  },
  recentSearchesContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  clearButton: {
    fontSize: 14,
    color: '#69DC9E',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  recentSearchIcon: {
    marginRight: 15,
  },
  recentSearchText: {
    flex: 1,
  },
  recentSearchMain: {
    fontSize: 15,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  recentSearchSecondary: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
});

export default EnhancedSearch;