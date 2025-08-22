import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { AUTH_CONFIG } from '../config/auth.config';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: AUTH_CONFIG.api.baseUrl,
      timeout: AUTH_CONFIG.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const credentials = await Keychain.getInternetCredentials('roamly_auth');
          if (credentials) {
            config.headers.Authorization = `Bearer ${credentials.password}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.logout();
          // Redirect to login
          // You might want to emit an event here that your app can listen to
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await this.api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signup(userData) {
    try {
      const response = await this.api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async socialLogin(provider, token) {
    try {
      const response = await this.api.post('/auth/social', {
        provider,
        token,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken() {
    try {
      const credentials = await Keychain.getInternetCredentials('roamly_auth');
      if (!credentials) {
        throw new Error('No refresh token found');
      }

      const response = await this.api.post('/auth/refresh', {
        refreshToken: credentials.password,
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await this.api.post('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await this.api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(token) {
    try {
      const response = await this.api.post('/auth/verify-email', {
        token,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(updates) {
    try {
      const response = await this.api.put('/users/profile', updates);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.api.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteAccount() {
    try {
      const response = await this.api.delete('/users/account');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      // Clear stored data
      await AsyncStorage.removeItem('user');
      await Keychain.resetInternetCredentials('roamly_auth');
      
      // Clear auth header
      delete this.api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
      };
    }
  }
}

export default new AuthService();