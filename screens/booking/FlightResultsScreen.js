import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeftIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TagIcon,
  CheckCircleIcon
} from 'react-native-heroicons/outline';
import { AirplaneIcon } from 'react-native-heroicons/solid';

const SORT_OPTIONS = [
  { id: 'price', label: 'Price (Low to High)', key: 'price', order: 'asc' },
  { id: 'price_desc', label: 'Price (High to Low)', key: 'price', order: 'desc' },
  { id: 'duration', label: 'Duration (Shortest)', key: 'duration', order: 'asc' },
  { id: 'departure', label: 'Departure Time', key: 'departure', order: 'asc' }
];

export default function FlightResultsScreen({ navigation, route }) {
  const { searchParams, results } = route.params;
  const [selectedSort, setSelectedSort] = useState('price');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    maxStops: null,
    priceRange: { min: 0, max: 10000 },
    airlines: [],
    departureTime: { morning: true, afternoon: true, evening: true, night: true }
  });

  // Sort and filter flights
  const processedFlights = useMemo(() => {
    let flights = [...results.flights];

    // Apply filters
    flights = flights.filter(flight => {
      // Price filter
      if (flight.price.amount < filters.priceRange.min || 
          flight.price.amount > filters.priceRange.max) {
        return false;
      }

      // Stops filter
      if (filters.maxStops !== null) {
        const stops = flight.itineraries[0].segments[0].numberOfStops;
        if (stops > filters.maxStops) return false;
      }

      // Airline filter
      if (filters.airlines.length > 0 && 
          !filters.airlines.includes(flight.airline)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    const sortOption = SORT_OPTIONS.find(opt => opt.id === selectedSort);
    flights.sort((a, b) => {
      let aValue, bValue;

      switch (sortOption.key) {
        case 'price':
          aValue = a.price.amount;
          bValue = b.price.amount;
          break;
        case 'duration':
          aValue = parseDuration(a.itineraries[0].duration);
          bValue = parseDuration(b.itineraries[0].duration);
          break;
        case 'departure':
          aValue = new Date(a.itineraries[0].segments[0].departure.at);
          bValue = new Date(b.itineraries[0].segments[0].departure.at);
          break;
        default:
          return 0;
      }

      return sortOption.order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return flights;
  }, [results.flights, selectedSort, filters]);

  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStopsText = (stops) => {
    if (stops === 0) return 'Non-stop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  const handleSelectFlight = (flight) => {
    Alert.alert(
      'Confirm Selection',
      `Select this ${flight.provider} flight for ${flight.price.display}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            navigation.navigate('FlightDetails', { 
              flight,
              searchParams 
            });
          }
        }
      ]
    );
  };

  const renderFlightCard = ({ item }) => {
    const outbound = item.itineraries[0];
    const segment = outbound.segments[0];

    return (
      <TouchableOpacity
        onPress={() => handleSelectFlight(item)}
        className="bg-white mx-4 mb-3 rounded-lg shadow-sm border border-gray-200 p-4"
      >
        {/* Price and Provider */}
        <View className="flex-row justify-between items-start mb-3">
          <View>
            <Text className="text-2xl font-bold text-green-600">
              {item.price.display}
            </Text>
            {item.priceComparison?.isLowest && (
              <View className="flex-row items-center mt-1">
                <TagIcon size={16} color="#059669" />
                <Text className="text-xs text-green-600 ml-1">Lowest price</Text>
              </View>
            )}
          </View>
          <View className="items-end">
            <Text className="text-sm font-medium">{item.provider}</Text>
            <Text className="text-xs text-gray-500">{item.airline || segment.carrierCode}</Text>
          </View>
        </View>

        {/* Flight Details */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold">{formatTime(segment.departure.at)}</Text>
            <Text className="text-sm text-gray-600">{segment.departure.iataCode}</Text>
          </View>

          <View className="flex-1 items-center px-2">
            <Text className="text-xs text-gray-500 mb-1">{formatDuration(outbound.duration)}</Text>
            <View className="flex-row items-center w-full">
              <View className="h-px bg-gray-300 flex-1" />
              <AirplaneIcon size={16} color="#6B7280" />
              <View className="h-px bg-gray-300 flex-1" />
            </View>
            <Text className="text-xs text-gray-500 mt-1">{getStopsText(segment.numberOfStops)}</Text>
          </View>

          <View className="flex-1 items-end">
            <Text className="text-lg font-semibold">{formatTime(segment.arrival.at)}</Text>
            <Text className="text-sm text-gray-600">{segment.arrival.iataCode}</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            {searchParams.travelClass.replace('_', ' ')} • Flight {segment.carrierCode}{segment.number}
          </Text>
          {item.priceComparison?.savings > 0 && (
            <Text className="text-xs text-green-600 ml-auto">
              Save {item.price.currency} {item.priceComparison.savings}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View className="bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold">
            {searchParams.origin} → {searchParams.destination}
          </Text>
          <Text className="text-sm text-gray-600">
            {new Date(searchParams.departureDate).toLocaleDateString()} 
            {searchParams.returnDate && ` - ${new Date(searchParams.returnDate).toLocaleDateString()}`}
          </Text>
        </View>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-gray-50">
        <Text className="text-sm text-gray-600">
          Found {processedFlights.length} flights from {results.providers} providers
        </Text>
        {results.errors.length > 0 && (
          <Text className="text-xs text-orange-600 mt-1">
            Some providers unavailable
          </Text>
        )}
      </View>

      {/* Sort and Filter Bar */}
      <View className="flex-row p-2 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setShowSortModal(true)}
          className="flex-1 flex-row items-center justify-center py-2"
        >
          <ArrowsUpDownIcon size={20} color="#3B82F6" />
          <Text className="ml-2 text-blue-500">Sort</Text>
        </TouchableOpacity>
        
        <View className="w-px bg-gray-300" />
        
        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          className="flex-1 flex-row items-center justify-center py-2"
        >
          <FunnelIcon size={20} color="#3B82F6" />
          <Text className="ml-2 text-blue-500">Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <FlatList
        data={processedFlights}
        renderItem={renderFlightCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="p-8 items-center">
            <Text className="text-gray-500 text-center">
              No flights found matching your criteria
            </Text>
          </View>
        }
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold mb-4">Sort By</Text>
            
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  setSelectedSort(option.id);
                  setShowSortModal(false);
                }}
                className="py-4 border-b border-gray-200 flex-row items-center justify-between"
              >
                <Text className={`text-lg ${
                  selectedSort === option.id ? 'text-blue-500 font-semibold' : ''
                }`}>
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <CheckCircleIcon size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              onPress={() => setShowSortModal(false)}
              className="mt-4 py-3"
            >
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal would go here - simplified for brevity */}
    </SafeAreaView>
  );
}