import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('API call error:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Specific hooks for common API calls
export const usePopularDestinations = () => {
  return useApi(() => apiService.getPopularDestinations());
};

export const useCategories = () => {
  return useApi(() => apiService.getCategories());
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addFavorite = async (item) => {
    try {
      const newFavorite = await apiService.addFavorite(item);
      setFavorites([...favorites, newFavorite]);
      return newFavorite;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFavorite = async (id) => {
    try {
      await apiService.removeFavorite(id);
      setFavorites(favorites.filter(fav => fav.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    refetch: fetchFavorites
  };
};

export const useSearch = (type) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (params) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      switch (type) {
        case 'hotels':
          data = await apiService.searchHotels(params);
          break;
        case 'restaurants':
          data = await apiService.searchRestaurants(params);
          break;
        case 'attractions':
          data = await apiService.searchAttractions(params);
          break;
        case 'shopping':
          data = await apiService.searchShopping(params);
          break;
        case 'flights':
          data = await apiService.searchFlights(params);
          break;
        default:
          data = await apiService.search(params.query, params.filters);
      }
      
      setResults(data);
      return data;
    } catch (err) {
      setError(err.message);
      setResults([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clear };
};