import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_CACHE_KEY = 'user_location_cache';
const LOCATION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.locationWatcher = null;
  }

  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  async checkPermissions() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  }

  async getCurrentLocation(forceRefresh = false) {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cachedLocation = await this.getCachedLocation();
        if (cachedLocation) {
          this.currentLocation = cachedLocation;
          return cachedLocation;
        }
      }

      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };

      this.currentLocation = locationData;
      await this.cacheLocation(locationData);
      
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  async watchLocation(callback, options = {}) {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      this.locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: options.timeInterval || 10000,
          distanceInterval: options.distanceInterval || 10,
        },
        (location) => {
          const locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          };
          this.currentLocation = locationData;
          this.cacheLocation(locationData);
          callback(locationData);
        }
      );

      return this.locationWatcher;
    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  }

  stopWatchingLocation() {
    if (this.locationWatcher) {
      this.locationWatcher.remove();
      this.locationWatcher = null;
    }
  }

  async cacheLocation(location) {
    try {
      const cacheData = {
        location,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  async getCachedLocation() {
    try {
      const cached = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (!cached) return null;

      const { location, timestamp } = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - timestamp > LOCATION_CACHE_DURATION) {
        await AsyncStorage.removeItem(LOCATION_CACHE_KEY);
        return null;
      }

      return location;
    } catch (error) {
      console.error('Error getting cached location:', error);
      return null;
    }
  }

  async reverseGeocode(latitude, longitude) {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (results && results.length > 0) {
        const address = results[0];
        return {
          city: address.city,
          country: address.country,
          region: address.region,
          street: address.street,
          postalCode: address.postalCode,
          formattedAddress: `${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''}`.trim(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  formatDistance(distanceKm) {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else {
      return `${distanceKm.toFixed(1)}km`;
    }
  }

  async getNearbyRecommendations(type, radius = 5) {
    try {
      const location = await this.getCurrentLocation();
      if (!location) {
        throw new Error('Unable to get current location');
      }

      // Calculate bounding box for the search
      const latRadius = radius / 111; // 1 degree latitude = ~111km
      const lonRadius = radius / (111 * Math.cos(location.latitude * Math.PI / 180));

      return {
        bl_lat: location.latitude - latRadius,
        bl_lng: location.longitude - lonRadius,
        tr_lat: location.latitude + latRadius,
        tr_lng: location.longitude + lonRadius,
        center: {
          lat: location.latitude,
          lng: location.longitude,
        },
      };
    } catch (error) {
      console.error('Error getting nearby recommendations:', error);
      throw error;
    }
  }
}

export default new LocationService();