import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from 'react-native-heroicons/outline';
import DateTimePicker from '@react-native-community/datetimepicker';
import unifiedBookingService from '../../services/booking/unifiedBookingService';

const TRAVEL_CLASSES = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'];

export default function FlightSearchScreen({ navigation }) {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: new Date(),
    returnDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'ECONOMY',
    nonStop: false,
    maxPrice: null,
    currency: 'USD'
  });

  const [tripType, setTripType] = useState('roundtrip'); // 'oneway' or 'roundtrip'
  const [showDatePicker, setShowDatePicker] = useState({ departure: false, return: false });
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async () => {
    // Validate inputs
    if (!searchParams.origin || !searchParams.destination) {
      Alert.alert('Missing Information', 'Please enter both origin and destination airports');
      return;
    }

    if (searchParams.origin.length !== 3 || searchParams.destination.length !== 3) {
      Alert.alert('Invalid Airport Code', 'Please enter valid 3-letter airport codes (e.g., LAX, JFK)');
      return;
    }

    setIsLoading(true);
    try {
      const params = {
        ...searchParams,
        departureDate: searchParams.departureDate.toISOString().split('T')[0],
        returnDate: tripType === 'roundtrip' && searchParams.returnDate 
          ? searchParams.returnDate.toISOString().split('T')[0] 
          : null
      };

      const results = await unifiedBookingService.searchFlights(params);
      
      if (results.flights.length === 0) {
        Alert.alert('No Flights Found', 'Try adjusting your search criteria');
      } else {
        navigation.navigate('FlightResults', { 
          searchParams: params, 
          results: results 
        });
      }
    } catch (error) {
      Alert.alert('Search Error', error.message || 'Failed to search flights');
    } finally {
      setIsLoading(false);
    }
  };

  const swapAirports = () => {
    setSearchParams({
      ...searchParams,
      origin: searchParams.destination,
      destination: searchParams.origin
    });
  };

  const updatePassengers = (type, increment) => {
    const newValue = searchParams[type] + increment;
    if (newValue >= 0) {
      setSearchParams({ ...searchParams, [type]: newValue });
    }
  };

  const getTotalPassengers = () => {
    return searchParams.adults + searchParams.children + searchParams.infants;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">Search Flights</Text>

          {/* Trip Type Selector */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setTripType('roundtrip')}
              className={`flex-1 py-3 rounded-l-lg ${
                tripType === 'roundtrip' ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Text className={`text-center font-semibold ${
                tripType === 'roundtrip' ? 'text-white' : 'text-gray-700'
              }`}>Round Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTripType('oneway')}
              className={`flex-1 py-3 rounded-r-lg ${
                tripType === 'oneway' ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Text className={`text-center font-semibold ${
                tripType === 'oneway' ? 'text-white' : 'text-gray-700'
              }`}>One Way</Text>
            </TouchableOpacity>
          </View>

          {/* Origin and Destination */}
          <View className="mb-4">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-gray-600 mb-1">From</Text>
                <TextInput
                  value={searchParams.origin}
                  onChangeText={(text) => setSearchParams({...searchParams, origin: text.toUpperCase()})}
                  placeholder="Airport code (e.g., LAX)"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  maxLength={3}
                  autoCapitalize="characters"
                />
              </View>
              
              <TouchableOpacity onPress={swapAirports} className="mx-3">
                <ArrowPathIcon size={24} color="#3B82F6" />
              </TouchableOpacity>

              <View className="flex-1">
                <Text className="text-gray-600 mb-1">To</Text>
                <TextInput
                  value={searchParams.destination}
                  onChangeText={(text) => setSearchParams({...searchParams, destination: text.toUpperCase()})}
                  placeholder="Airport code (e.g., JFK)"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  maxLength={3}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>

          {/* Dates */}
          <View className="mb-4">
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowDatePicker({ ...showDatePicker, departure: true })}
                className="flex-1 mr-2"
              >
                <Text className="text-gray-600 mb-1">Departure</Text>
                <View className="border border-gray-300 rounded-lg px-4 py-3 flex-row items-center">
                  <CalendarIcon size={20} color="#6B7280" />
                  <Text className="ml-2 text-lg">
                    {searchParams.departureDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>

              {tripType === 'roundtrip' && (
                <TouchableOpacity
                  onPress={() => setShowDatePicker({ ...showDatePicker, return: true })}
                  className="flex-1 ml-2"
                >
                  <Text className="text-gray-600 mb-1">Return</Text>
                  <View className="border border-gray-300 rounded-lg px-4 py-3 flex-row items-center">
                    <CalendarIcon size={20} color="#6B7280" />
                    <Text className="ml-2 text-lg">
                      {searchParams.returnDate 
                        ? searchParams.returnDate.toLocaleDateString()
                        : 'Select date'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Passengers and Class */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setShowPassengerModal(true)}
              className="flex-1 mr-2"
            >
              <Text className="text-gray-600 mb-1">Passengers</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <UserGroupIcon size={20} color="#6B7280" />
                  <Text className="ml-2 text-lg">{getTotalPassengers()}</Text>
                </View>
                <ChevronDownIcon size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowClassModal(true)}
              className="flex-1 ml-2"
            >
              <Text className="text-gray-600 mb-1">Class</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between">
                <Text className="text-lg capitalize">
                  {searchParams.travelClass.toLowerCase().replace('_', ' ')}
                </Text>
                <ChevronDownIcon size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Additional Options */}
          <TouchableOpacity
            onPress={() => setSearchParams({...searchParams, nonStop: !searchParams.nonStop})}
            className="flex-row items-center mb-4"
          >
            <View className={`w-6 h-6 rounded border-2 mr-2 ${
              searchParams.nonStop ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
            }`}>
              {searchParams.nonStop && (
                <Text className="text-white text-center text-sm">✓</Text>
              )}
            </View>
            <Text className="text-lg">Non-stop flights only</Text>
          </TouchableOpacity>

          {/* Search Button */}
          <TouchableOpacity
            onPress={handleSearch}
            disabled={isLoading}
            className="bg-blue-500 rounded-lg py-4 flex-row items-center justify-center"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MagnifyingGlassIcon size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-2">
                  Search Flights
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showDatePicker.departure && (
        <DateTimePicker
          value={searchParams.departureDate}
          mode="date"
          minimumDate={new Date()}
          onChange={(event, date) => {
            setShowDatePicker({ ...showDatePicker, departure: false });
            if (date) {
              setSearchParams({ ...searchParams, departureDate: date });
              // Reset return date if it's before departure
              if (searchParams.returnDate && date > searchParams.returnDate) {
                setSearchParams({ ...searchParams, departureDate: date, returnDate: null });
              }
            }
          }}
        />
      )}

      {showDatePicker.return && (
        <DateTimePicker
          value={searchParams.returnDate || searchParams.departureDate}
          mode="date"
          minimumDate={searchParams.departureDate}
          onChange={(event, date) => {
            setShowDatePicker({ ...showDatePicker, return: false });
            if (date) {
              setSearchParams({ ...searchParams, returnDate: date });
            }
          }}
        />
      )}

      {/* Passenger Modal */}
      <Modal
        visible={showPassengerModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold">Select Passengers</Text>
              <TouchableOpacity onPress={() => setShowPassengerModal(false)}>
                <XMarkIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Adults */}
            <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
              <View>
                <Text className="text-lg font-semibold">Adults</Text>
                <Text className="text-gray-600">Age 12+</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updatePassengers('adults', -1)}
                  disabled={searchParams.adults <= 1}
                  className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
                >
                  <Text className="text-xl">-</Text>
                </TouchableOpacity>
                <Text className="mx-4 text-lg">{searchParams.adults}</Text>
                <TouchableOpacity
                  onPress={() => updatePassengers('adults', 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
                >
                  <Text className="text-xl">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Children */}
            <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
              <View>
                <Text className="text-lg font-semibold">Children</Text>
                <Text className="text-gray-600">Age 2-11</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updatePassengers('children', -1)}
                  disabled={searchParams.children <= 0}
                  className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
                >
                  <Text className="text-xl">-</Text>
                </TouchableOpacity>
                <Text className="mx-4 text-lg">{searchParams.children}</Text>
                <TouchableOpacity
                  onPress={() => updatePassengers('children', 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
                >
                  <Text className="text-xl">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Infants */}
            <View className="flex-row items-center justify-between py-4">
              <View>
                <Text className="text-lg font-semibold">Infants</Text>
                <Text className="text-gray-600">Under 2</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updatePassengers('infants', -1)}
                  disabled={searchParams.infants <= 0}
                  className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
                >
                  <Text className="text-xl">-</Text>
                </TouchableOpacity>
                <Text className="mx-4 text-lg">{searchParams.infants}</Text>
                <TouchableOpacity
                  onPress={() => updatePassengers('infants', 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center"
                >
                  <Text className="text-xl">+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowPassengerModal(false)}
              className="bg-blue-500 rounded-lg py-3 mt-4"
            >
              <Text className="text-white text-center text-lg font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Class Modal */}
      <Modal
        visible={showClassModal}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold">Select Class</Text>
              <TouchableOpacity onPress={() => setShowClassModal(false)}>
                <XMarkIcon size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {TRAVEL_CLASSES.map((travelClass) => (
              <TouchableOpacity
                key={travelClass}
                onPress={() => {
                  setSearchParams({ ...searchParams, travelClass });
                  setShowClassModal(false);
                }}
                className={`py-4 border-b border-gray-200 ${
                  searchParams.travelClass === travelClass ? 'bg-blue-50' : ''
                }`}
              >
                <Text className={`text-lg capitalize ${
                  searchParams.travelClass === travelClass ? 'text-blue-500 font-semibold' : ''
                }`}>
                  {travelClass.toLowerCase().replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}