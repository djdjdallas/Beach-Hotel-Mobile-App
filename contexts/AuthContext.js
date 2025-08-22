import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from storage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem('user');
      const credentials = await Keychain.getInternetCredentials('roamly_auth');
      
      if (storedUser && credentials) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${credentials.password}`;
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.login(email, password);
      const { user, token } = response;

      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Store token securely
      await Keychain.setInternetCredentials(
        'roamly_auth',
        email,
        token
      );

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.signup(userData);
      const { user, token } = response;

      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Store token securely
      await Keychain.setInternetCredentials(
        'roamly_auth',
        userData.email,
        token
      );

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider, accessToken) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.socialLogin(provider, accessToken);
      const { user, token } = response;

      // Store user data
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Store token securely
      await Keychain.setInternetCredentials(
        'roamly_auth',
        user.email,
        token
      );

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Social login failed');
      return { success: false, error: error.response?.data?.message || 'Social login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear stored data
      await AsyncStorage.removeItem('user');
      await Keychain.resetInternetCredentials('roamly_auth');
      
      // Clear auth header
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (updates) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const updatedUser = await authService.updateProfile(updates);
      
      // Update stored user
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
      return { success: false, error: error.response?.data?.message || 'Update failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    signup,
    socialLogin,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};