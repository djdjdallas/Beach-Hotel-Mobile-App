import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  HeartIcon,
  StarIcon,
  MapPinIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';
import * as Animatable from 'react-native-animatable';
import { useFavorites } from '../hooks/useApi';

const Favorites = () => {
  const navigation = useNavigation();
  const { favorites, loading, error, removeFavorite: removeFromAPI, refetch } = useFavorites();

  const removeFavorite = async (id) => {
    try {
      await removeFromAPI(id);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const renderFavorite = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      className="mx-5 mb-4"
    >
      <TouchableOpacity
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PromoCard', { data: item })}
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.image }}
            className="w-28 h-28"
          />
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-xs text-[#69DC9E] font-semibold uppercase">
                    {item.type}
                  </Text>
                </View>
                <Text className="text-gray-900 font-bold text-base" numberOfLines={1}>
                  {item.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MapPinIcon size={12} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1" numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeFavorite(item.id)}
                className="ml-2"
              >
                <XMarkIcon size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                <StarIcon size={14} color="#FFC107" />
                <Text className="text-gray-700 text-sm font-medium ml-1">
                  {item.rating}
                </Text>
                <Text className="text-gray-500 text-xs ml-1">
                  ({item.reviews})
                </Text>
              </View>
              {item.price && (
                <Text className="text-[#69DC9E] font-bold">
                  {item.price}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const EmptyFavorites = () => (
    <View className="flex-1 justify-center items-center px-8">
      <HeartIcon size={80} color="#E5E7EB" />
      <Text className="text-gray-900 text-xl font-bold mt-4">
        No favorites yet
      </Text>
      <Text className="text-gray-600 text-center mt-2">
        Start exploring and tap the heart icon on places you love to save them here
      </Text>
      <TouchableOpacity
        className="bg-[#69DC9E] px-6 py-3 rounded-full mt-6"
        onPress={() => navigation.navigate('HomeTab')}
      >
        <Text className="text-white font-semibold">Start Exploring</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-5 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">My Favorites</Text>
        <Text className="text-gray-600 text-sm mt-1">
          {favorites?.length || 0} {favorites?.length === 1 ? 'place' : 'places'} saved
        </Text>
      </View>

      {/* Loading State */}
      {loading && !favorites ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#69DC9E" />
          <Text className="text-gray-600 mt-4">Loading your favorites...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-gray-900 text-lg font-semibold mb-2">Oops!</Text>
          <Text className="text-gray-600 text-center mb-4">
            We couldn't load your favorites. Please try again.
          </Text>
          <TouchableOpacity
            className="bg-[#69DC9E] px-6 py-3 rounded-full"
            onPress={refetch}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Favorites List */
        <FlatList
          data={favorites || []}
          renderItem={renderFavorite}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={EmptyFavorites}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && !!favorites}
              onRefresh={refetch}
              tintColor="#69DC9E"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Favorites;