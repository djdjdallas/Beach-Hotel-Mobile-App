import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import travelService from '../services/travel.service';

const FlightSearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { origin, destination, departureDate, returnDate, passengers } = route.params || {};

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price'); // price, duration, departure

  useEffect(() => {
    if (origin && destination && departureDate) {
      searchFlights();
    }
  }, [origin, destination, departureDate, returnDate]);

  const searchFlights = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const results = await travelService.searchFlights({
        origin: origin.iataCode || origin.code,
        destination: destination.iataCode || destination.code,
        departureDate,
        returnDate,
        adults: passengers?.adults || 1,
        travelClass: passengers?.class || 'ECONOMY',
      });

      const sortedFlights = sortFlights(results, sortBy);
      setFlights(sortedFlights);
    } catch (error) {
      console.error('Flight search error:', error);
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const sortFlights = (flightList, criteria) => {
    const sorted = [...flightList];
    
    switch (criteria) {
      case 'price':
        return sorted.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
      case 'duration':
        return sorted.sort((a, b) => {
          const durationA = parseDuration(a.itineraries[0].duration);
          const durationB = parseDuration(b.itineraries[0].duration);
          return durationA - durationB;
        });
      case 'departure':
        return sorted.sort((a, b) => {
          const depA = new Date(a.itineraries[0].segments[0].departure.at);
          const depB = new Date(b.itineraries[0].segments[0].departure.at);
          return depA - depB;
        });
      default:
        return sorted;
    }
  };

  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match[1] ? match[1].replace('H', 'h ') : '';
    const minutes = match[2] ? match[2].replace('M', 'm') : '';
    return `${hours}${minutes}`.trim();
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleFlightPress = (flight) => {
    navigation.navigate('FlightDetails', {
      flight,
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
    });
  };

  const renderFlightSegment = (segment, isReturn = false) => {
    const stops = segment.numberOfStops || 0;
    
    return (
      <View style={styles.segmentContainer}>
        <View style={styles.segmentRow}>
          <View style={styles.airportInfo}>
            <Text style={styles.time}>{formatTime(segment.departure.at)}</Text>
            <Text style={styles.airport}>{segment.departure.iataCode}</Text>
          </View>
          
          <View style={styles.flightPath}>
            <View style={styles.flightLine}>
              <View style={styles.flightDot} />
              <View style={styles.flightLineInner} />
              <View style={styles.flightDot} />
            </View>
            <Text style={styles.duration}>{formatDuration(segment.duration)}</Text>
            {stops > 0 && (
              <Text style={styles.stops}>{stops} stop{stops > 1 ? 's' : ''}</Text>
            )}
          </View>
          
          <View style={styles.airportInfo}>
            <Text style={styles.time}>{formatTime(segment.arrival.at)}</Text>
            <Text style={styles.airport}>{segment.arrival.iataCode}</Text>
          </View>
        </View>
        
        <Text style={styles.airline}>
          {segment.carrierCode} {segment.number}
        </Text>
      </View>
    );
  };

  const renderFlightItem = ({ item }) => {
    const outboundSegments = item.itineraries[0].segments;
    const returnSegments = item.itineraries[1]?.segments;
    
    return (
      <TouchableOpacity
        style={styles.flightCard}
        onPress={() => handleFlightPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.flightHeader}>
          <Text style={styles.flightType}>
            {returnSegments ? 'Round Trip' : 'One Way'}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price.total}</Text>
            <Text style={styles.priceSubtext}>per person</Text>
          </View>
        </View>

        <View style={styles.segmentsContainer}>
          <View style={styles.segmentWrapper}>
            <Text style={styles.segmentLabel}>Outbound • {formatDate(outboundSegments[0].departure.at)}</Text>
            {outboundSegments.map((segment, index) => (
              <View key={index}>
                {renderFlightSegment(segment)}
                {index < outboundSegments.length - 1 && (
                  <View style={styles.layover}>
                    <Icon name="schedule" type="material" size={14} color="#666" />
                    <Text style={styles.layoverText}>
                      Layover in {segment.arrival.iataCode}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {returnSegments && (
            <View style={styles.segmentWrapper}>
              <Text style={styles.segmentLabel}>Return • {formatDate(returnSegments[0].departure.at)}</Text>
              {returnSegments.map((segment, index) => (
                <View key={index}>
                  {renderFlightSegment(segment, true)}
                  {index < returnSegments.length - 1 && (
                    <View style={styles.layover}>
                      <Icon name="schedule" type="material" size={14} color="#666" />
                      <Text style={styles.layoverText}>
                        Layover in {segment.arrival.iataCode}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.flightFooter}>
          <View style={styles.cabinInfo}>
            <Icon name="airline-seat-recline-normal" type="material" size={16} color="#666" />
            <Text style={styles.cabinText}>{passengers?.class || 'Economy'}</Text>
          </View>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectButtonText}>Select</Text>
            <Icon name="chevron-right" type="material" size={20} color="#69DC9E" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSortOptions = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.sortContainer}
      contentContainerStyle={styles.sortContent}
    >
      {[
        { key: 'price', label: 'Price', icon: 'attach-money' },
        { key: 'duration', label: 'Duration', icon: 'schedule' },
        { key: 'departure', label: 'Departure', icon: 'flight-takeoff' },
      ].map(option => (
        <TouchableOpacity
          key={option.key}
          style={[styles.sortOption, sortBy === option.key && styles.sortOptionActive]}
          onPress={() => {
            setSortBy(option.key);
            setFlights(sortFlights(flights, option.key));
          }}
        >
          <Icon 
            name={option.icon} 
            type="material" 
            size={16} 
            color={sortBy === option.key ? '#69DC9E' : '#666'} 
          />
          <Text style={[
            styles.sortOptionText,
            sortBy === option.key && styles.sortOptionTextActive
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="flight" type="material" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No flights found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search criteria or dates
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => searchFlights()}
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
          <Text style={styles.headerTitle}>
            {origin?.city || origin?.name} → {destination?.city || destination?.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {departureDate} {returnDate ? `- ${returnDate}` : ''} • {passengers?.adults || 1} passenger(s)
          </Text>
        </View>
      </View>

      {renderSortOptions()}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#69DC9E" />
          <Text style={styles.loadingText}>Searching flights...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => searchFlights()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={flights}
          renderItem={renderFlightItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => searchFlights(true)}
              colors={['#69DC9E']}
              tintColor="#69DC9E"
            />
          }
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
  sortContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sortContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  sortOptionActive: {
    backgroundColor: '#e8f8f0',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  sortOptionTextActive: {
    color: '#69DC9E',
    fontWeight: '600',
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
  flightCard: {
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
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  flightType: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#69DC9E',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  priceSubtext: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  segmentsContainer: {
    padding: 15,
  },
  segmentWrapper: {
    marginBottom: 20,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  segmentContainer: {
    marginBottom: 10,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  airportInfo: {
    alignItems: 'center',
    width: 60,
  },
  time: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  airport: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  flightPath: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  flightLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  flightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#69DC9E',
  },
  flightLineInner: {
    flex: 1,
    height: 2,
    backgroundColor: '#69DC9E',
  },
  duration: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  stops: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  airline: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  layover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  layoverText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  flightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cabinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cabinText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#69DC9E',
    marginRight: 5,
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

export default FlightSearchScreen;