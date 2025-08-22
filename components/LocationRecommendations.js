import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import locationService from '../services/locationService';
import { getPlacesData } from '../api/Index';

const LocationRecommendations = ({ type, onSelectRecommendation }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const nearbyRadiusOptions = [
    { label: '1 km', value: 1 },
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
  ];

  useEffect(() => {
    if (type) {
      loadNearbyRecommendations(5); // Default 5km radius
    }
  }, [type]);

  const loadNearbyRecommendations = async (radius) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get location bounds
      const bounds = await locationService.getNearbyRecommendations(type, radius);
      
      // Get user's address for display
      const location = await locationService.getCurrentLocation();
      const address = await locationService.reverseGeocode(
        location.latitude,
        location.longitude
      );
      setUserAddress(address);

      // Fetch places data
      const data = await getPlacesData(
        bounds.bl_lat,
        bounds.bl_lng,
        bounds.tr_lat,
        bounds.tr_lng,
        type
      );

      if (data && data.length > 0) {
        // Calculate distances and sort by distance
        const placesWithDistance = data.map(place => {
          const distance = locationService.calculateDistance(
            bounds.center.lat,
            bounds.center.lng,
            parseFloat(place.latitude),
            parseFloat(place.longitude)
          );
          return { ...place, distance };
        });

        // Sort by distance and take top 10
        const sorted = placesWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10);

        setRecommendations(sorted);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationPress = (place) => {
    if (onSelectRecommendation) {
      onSelectRecommendation({
        bl_lat: place.latitude - 0.01,
        bl_lng: place.longitude - 0.01,
        tr_lat: place.latitude + 0.01,
        tr_lng: place.longitude + 0.01,
        center: {
          lat: place.latitude,
          lng: place.longitude,
        },
        selectedPlace: place,
      });
    }
  };

  const getCategoryIcon = () => {
    switch (type) {
      case 'hotels':
        return 'hotel';
      case 'restaurants':
        return 'restaurant';
      case 'attractions':
        return 'attractions';
      default:
        return 'place';
    }
  };

  const getCategoryColor = () => {
    switch (type) {
      case 'hotels':
        return '#FF6B6B';
      case 'restaurants':
        return '#4ECDC4';
      case 'attractions':
        return '#69DC9E';
      default:
        return '#666';
    }
  };

  if (!type) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="near-me"
          type="material"
          color="#69DC9E"
          size={20}
        />
        <Text style={styles.headerTitle}>Near You</Text>
        {userAddress && (
          <Text style={styles.locationText} numberOfLines={1}>
            {userAddress.city || userAddress.region}
          </Text>
        )}
      </View>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.radiusContainer}
      >
        {nearbyRadiusOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.radiusButton}
            onPress={() => loadNearbyRecommendations(option.value)}
          >
            <Text style={styles.radiusText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#69DC9E" />
          <Text style={styles.loadingText}>Finding nearby places...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" type="material" color="#FF6B6B" size={24} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadNearbyRecommendations(5)}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : recommendations.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recommendationsScroll}
        >
          {recommendations.map((place, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recommendationCard}
              onPress={() => handleRecommendationPress(place)}
            >
              <View style={[styles.iconContainer, { backgroundColor: getCategoryColor() }]}>
                <Icon
                  name={getCategoryIcon()}
                  type="material"
                  color="white"
                  size={24}
                />
              </View>
              <Text style={styles.placeName} numberOfLines={1}>
                {place.name}
              </Text>
              <View style={styles.placeInfo}>
                <Icon name="star" type="material" color="#FFD700" size={14} />
                <Text style={styles.placeRating}>{place.rating || 'N/A'}</Text>
                <Text style={styles.placeDistance}>
                  {locationService.formatDistance(place.distance)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No nearby {type} found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  radiusContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  radiusButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  radiusText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  retryButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#69DC9E',
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  recommendationsScroll: {
    paddingHorizontal: 15,
  },
  recommendationCard: {
    width: 120,
    marginRight: 12,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  placeRating: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  placeDistance: {
    fontSize: 12,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
});

export default LocationRecommendations;