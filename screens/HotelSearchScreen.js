import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import travelService from '../services/travel.service';
import SearchFilters from '../components/SearchFilters';

const HotelSearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { location, checkIn, checkOut, guests } = route.params || {};

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    rating: null,
    amenities: [],
    source: 'both',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (location) {
      searchHotels();
    }
  }, [location, checkIn, checkOut]);

  const searchHotels = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const results = await travelService.searchHotels({
        location,
        checkIn,
        checkOut,
        adults: guests?.adults || 1,
        children: guests?.children || 0,
        rooms: guests?.rooms || 1,
        ...filters,
      });

      setHotels(results.combined || []);
    } catch (error) {
      console.error('Hotel search error:', error);
      setError('Failed to search hotels. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', {
      hotel,
      checkIn,
      checkOut,
      guests,
    });
  };

  const handleFiltersApply = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
    searchHotels();
  };

  const renderHotelItem = ({ item }) => {
    const price = item.source === 'amadeus' 
      ? item.offers?.[0]?.price 
      : item.price;
    
    const rating = item.source === 'amadeus'
      ? item.rating
      : item.rating?.score;

    return (
      <TouchableOpacity
        style={styles.hotelCard}
        onPress={() => handleHotelPress(item)}
        activeOpacity={0.9}
      >
        <Image
          source={{ 
            uri: item.mainPhoto?.url || 
                 item.media?.[0]?.uri ||
                 'https://via.placeholder.com/300x200'
          }}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <View style={styles.hotelInfo}>
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.sourceTag}>
              <Text style={styles.sourceText}>
                {item.source === 'amadeus' ? 'Amadeus' : 'Booking'}
              </Text>
            </View>
          </View>
          
          <View style={styles.hotelLocation}>
            <Icon name="location-on" type="material" size={16} color="#666" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.address?.lines?.[0] || item.address || 'Location not available'}
            </Text>
          </View>

          <View style={styles.hotelFooter}>
            <View style={styles.ratingContainer}>
              {rating && (
                <>
                  <Icon name="star" type="material" size={18} color="#FFD700" />
                  <Text style={styles.ratingText}>{rating}</Text>
                  {item.rating?.reviewCount && (
                    <Text style={styles.reviewCount}>
                      ({item.rating.reviewCount} reviews)
                    </Text>
                  )}
                </>
              )}
            </View>
            
            {price && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceAmount}>
                  ${price.amount || price.originalAmount}
                </Text>
                <Text style={styles.pricePeriod}>per night</Text>
              </View>
            )}
          </View>

          {item.amenities && item.amenities.length > 0 && (
            <View style={styles.amenitiesContainer}>
              {item.amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>
                    {typeof amenity === 'string' ? amenity : amenity.name}
                  </Text>
                </View>
              ))}
              {item.amenities.length > 3 && (
                <Text style={styles.moreAmenities}>
                  +{item.amenities.length - 3} more
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="hotel" type="material" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No hotels found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your filters or search criteria
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => searchHotels()}
      >
        <Text style={styles.retryButtonText}>Retry Search</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" type="material" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {location?.mainText || location?.description || 'Hotels'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {checkIn} - {checkOut} • {guests?.adults || 1} guest(s)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter-list" type="material" size={24} color="#69DC9E" />
          {Object.values(filters).some(v => v && v.length > 0) && (
            <View style={styles.filterBadge} />
          )}
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#69DC9E" />
          <Text style={styles.loadingText}>Searching hotels...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => searchHotels()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={hotels}
          renderItem={renderHotelItem}
          keyExtractor={(item) => `${item.source}_${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => searchHotels(true)}
              colors={['#69DC9E']}
              tintColor="#69DC9E"
            />
          }
        />
      )}

      {showFilters && (
        <SearchFilters
          visible={showFilters}
          filters={filters}
          onApply={handleFiltersApply}
          onClose={() => setShowFilters(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  filterButton: {
    padding: 5,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#69DC9E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  retryButton: {
    backgroundColor: '#69DC9E',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  listContent: {
    paddingVertical: 10,
  },
  hotelCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotelName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  sourceTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  hotelLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#69DC9E',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  amenityTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  amenityText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  moreAmenities: {
    fontSize: 12,
    color: '#69DC9E',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
});

export default HotelSearchScreen;