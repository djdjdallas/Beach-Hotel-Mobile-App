import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import EnhancedSearchResults from '../components/EnhancedSearchResults';
import searchService from '../services/searchService';
import locationService from '../services/locationService';

const Favorites = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
      getUserLocation();
    }, [])
  );

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
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const navigateToDetails = (favorite) => {
    navigation.navigate('PromoCard', {
      param: {
        data: { place_id: favorite.placeId },
        imgUrl: favorite.imgUrl,
        title: favorite.title,
        location: favorite.location,
        lat: favorite.lat,
        long: favorite.long,
        rating: favorite.rating,
        type: favorite.type,
        isFavorite: true,
      },
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="favorite-border" type="material" color="#ccc" size={80} />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring and save your favorite places
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.exploreButtonText}>Explore Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavoriteItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => navigateToDetails(item)}>
      <EnhancedSearchResults
        index={index}
        data={{ place_id: item.placeId }}
        title={item.title}
        imgUrl={item.imgUrl}
        location={item.location}
        lat={item.lat}
        long={item.long}
        rating={item.rating}
        type={item.type}
        userLocation={userLocation}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'place' : 'places'} saved
        </Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.placeId}
          renderItem={renderFavoriteItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#69DC9E']}
              tintColor="#69DC9E"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  exploreButton: {
    marginTop: 30,
    backgroundColor: '#69DC9E',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
});

export default Favorites;