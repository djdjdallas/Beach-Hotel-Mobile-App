import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = 'recent_searches';
const FAVORITES_KEY = 'favorite_places';
const MAX_RECENT_SEARCHES = 10;

class SearchService {
  constructor() {
    this.recentSearches = [];
    this.favorites = [];
    this.loadData();
  }

  async loadData() {
    try {
      const [recentSearchesData, favoritesData] = await Promise.all([
        AsyncStorage.getItem(RECENT_SEARCHES_KEY),
        AsyncStorage.getItem(FAVORITES_KEY),
      ]);

      this.recentSearches = recentSearchesData ? JSON.parse(recentSearchesData) : [];
      this.favorites = favoritesData ? JSON.parse(favoritesData) : [];
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  }

  async addRecentSearch(searchData) {
    try {
      // Check if the search already exists
      const existingIndex = this.recentSearches.findIndex(
        search => search.placeId === searchData.placeId
      );

      if (existingIndex > -1) {
        // Move existing search to the front
        this.recentSearches.splice(existingIndex, 1);
      }

      // Add new search to the beginning
      this.recentSearches.unshift({
        ...searchData,
        timestamp: new Date().toISOString(),
      });

      // Keep only the most recent searches
      if (this.recentSearches.length > MAX_RECENT_SEARCHES) {
        this.recentSearches = this.recentSearches.slice(0, MAX_RECENT_SEARCHES);
      }

      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches));
      return this.recentSearches;
    } catch (error) {
      console.error('Error adding recent search:', error);
      throw error;
    }
  }

  async getRecentSearches() {
    try {
      await this.loadData();
      return this.recentSearches;
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  async clearRecentSearches() {
    try {
      this.recentSearches = [];
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing recent searches:', error);
      throw error;
    }
  }

  async addFavorite(place) {
    try {
      // Check if already favorited
      const existingIndex = this.favorites.findIndex(
        fav => fav.placeId === place.placeId
      );

      if (existingIndex === -1) {
        this.favorites.push({
          ...place,
          addedAt: new Date().toISOString(),
        });
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
      }
      return this.favorites;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(placeId) {
    try {
      this.favorites = this.favorites.filter(fav => fav.placeId !== placeId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites));
      return this.favorites;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getFavorites() {
    try {
      await this.loadData();
      return this.favorites;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async isFavorite(placeId) {
    try {
      await this.loadData();
      return this.favorites.some(fav => fav.placeId === placeId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  async toggleFavorite(place) {
    try {
      const isFav = await this.isFavorite(place.placeId);
      if (isFav) {
        return await this.removeFavorite(place.placeId);
      } else {
        return await this.addFavorite(place);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  // Search filters and sorting
  applyFilters(results, filters) {
    let filtered = [...results];

    // Filter by rating
    if (filters.minRating) {
      filtered = filtered.filter(item => 
        parseFloat(item.rating || 0) >= filters.minRating
      );
    }

    // Filter by price level
    if (filters.priceLevel && filters.priceLevel.length > 0) {
      filtered = filtered.filter(item => 
        filters.priceLevel.includes(item.price_level)
      );
    }

    // Filter by open now
    if (filters.openNow) {
      filtered = filtered.filter(item => item.is_closed === false);
    }

    // Filter by distance (if coordinates provided)
    if (filters.maxDistance && filters.userLocation) {
      filtered = filtered.filter(item => {
        const distance = this.calculateDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          item.latitude,
          item.longitude
        );
        return distance <= filters.maxDistance;
      });
    }

    return filtered;
  }

  sortResults(results, sortBy, userLocation = null) {
    const sorted = [...results];

    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => 
          parseFloat(b.rating || 0) - parseFloat(a.rating || 0)
        );
      
      case 'reviews':
        return sorted.sort((a, b) => 
          parseInt(b.num_reviews || 0) - parseInt(a.num_reviews || 0)
        );
      
      case 'price_low':
        return sorted.sort((a, b) => {
          const priceA = a.price_level || '$$';
          const priceB = b.price_level || '$$';
          return priceA.length - priceB.length;
        });
      
      case 'price_high':
        return sorted.sort((a, b) => {
          const priceA = a.price_level || '$$';
          const priceB = b.price_level || '$$';
          return priceB.length - priceA.length;
        });
      
      case 'distance':
        if (!userLocation) return sorted;
        return sorted.sort((a, b) => {
          const distA = this.calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.latitude,
            a.longitude
          );
          const distB = this.calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.latitude,
            b.longitude
          );
          return distA - distB;
        });
      
      default:
        return sorted;
    }
  }

  // Helper function to calculate distance between two coordinates
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

  // Get search suggestions based on user input and history
  async getSearchSuggestions(query) {
    try {
      await this.loadData();
      
      if (!query || query.length < 2) return [];

      const lowerQuery = query.toLowerCase();
      
      // Filter recent searches that match the query
      const matchingSearches = this.recentSearches
        .filter(search => 
          search.description.toLowerCase().includes(lowerQuery) ||
          search.mainText.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5);

      return matchingSearches;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }
}

export default new SearchService();