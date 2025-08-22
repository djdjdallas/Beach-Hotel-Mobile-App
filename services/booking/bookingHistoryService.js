import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Booking History Service
 * Manages user's booking history and saved bookings
 */
class BookingHistoryService {
  constructor() {
    this.STORAGE_KEY = '@booking_history';
    this.SAVED_BOOKINGS_KEY = '@saved_bookings';
  }

  /**
   * Save a new booking to history
   */
  async saveBooking(booking) {
    try {
      const history = await this.getBookingHistory();
      
      const newBooking = {
        id: booking.id || `booking_${Date.now()}`,
        type: booking.type, // 'flight', 'hotel', 'activity'
        provider: booking.provider,
        status: booking.status || 'confirmed',
        createdAt: new Date().toISOString(),
        ...booking
      };

      history.unshift(newBooking); // Add to beginning
      
      // Keep only last 100 bookings
      if (history.length > 100) {
        history.pop();
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      return newBooking;
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  /**
   * Get all booking history
   */
  async getBookingHistory() {
    try {
      const historyJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting booking history:', error);
      return [];
    }
  }

  /**
   * Get bookings filtered by type
   */
  async getBookingsByType(type) {
    const history = await this.getBookingHistory();
    return history.filter(booking => booking.type === type);
  }

  /**
   * Get bookings filtered by status
   */
  async getBookingsByStatus(status) {
    const history = await this.getBookingHistory();
    return history.filter(booking => booking.status === status);
  }

  /**
   * Get a specific booking by ID
   */
  async getBookingById(bookingId) {
    const history = await this.getBookingHistory();
    return history.find(booking => booking.id === bookingId);
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId, newStatus) {
    try {
      const history = await this.getBookingHistory();
      const bookingIndex = history.findIndex(booking => booking.id === bookingId);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }

      history[bookingIndex].status = newStatus;
      history[bookingIndex].updatedAt = new Date().toISOString();

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      return history[bookingIndex];
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId) {
    return this.updateBookingStatus(bookingId, 'cancelled');
  }

  /**
   * Get upcoming bookings
   */
  async getUpcomingBookings() {
    const history = await this.getBookingHistory();
    const now = new Date();

    return history.filter(booking => {
      if (booking.status === 'cancelled') return false;
      
      // Check dates based on booking type
      if (booking.type === 'flight' && booking.departureDate) {
        return new Date(booking.departureDate) > now;
      } else if (booking.type === 'hotel' && booking.checkInDate) {
        return new Date(booking.checkInDate) > now;
      } else if (booking.type === 'activity' && booking.date) {
        return new Date(booking.date) > now;
      }
      
      return false;
    }).sort((a, b) => {
      // Sort by date
      const dateA = a.departureDate || a.checkInDate || a.date;
      const dateB = b.departureDate || b.checkInDate || b.date;
      return new Date(dateA) - new Date(dateB);
    });
  }

  /**
   * Get past bookings
   */
  async getPastBookings() {
    const history = await this.getBookingHistory();
    const now = new Date();

    return history.filter(booking => {
      if (booking.status === 'cancelled') return true;
      
      // Check dates based on booking type
      if (booking.type === 'flight' && booking.departureDate) {
        return new Date(booking.departureDate) <= now;
      } else if (booking.type === 'hotel' && booking.checkOutDate) {
        return new Date(booking.checkOutDate) <= now;
      } else if (booking.type === 'activity' && booking.date) {
        return new Date(booking.date) <= now;
      }
      
      return false;
    });
  }

  /**
   * Save a booking for later (wishlist)
   */
  async saveForLater(item) {
    try {
      const saved = await this.getSavedBookings();
      
      const newSaved = {
        id: `saved_${Date.now()}`,
        savedAt: new Date().toISOString(),
        ...item
      };

      saved.unshift(newSaved);
      
      await AsyncStorage.setItem(this.SAVED_BOOKINGS_KEY, JSON.stringify(saved));
      return newSaved;
    } catch (error) {
      console.error('Error saving item for later:', error);
      throw error;
    }
  }

  /**
   * Get all saved bookings
   */
  async getSavedBookings() {
    try {
      const savedJson = await AsyncStorage.getItem(this.SAVED_BOOKINGS_KEY);
      return savedJson ? JSON.parse(savedJson) : [];
    } catch (error) {
      console.error('Error getting saved bookings:', error);
      return [];
    }
  }

  /**
   * Remove a saved booking
   */
  async removeSavedBooking(savedId) {
    try {
      const saved = await this.getSavedBookings();
      const filtered = saved.filter(item => item.id !== savedId);
      
      await AsyncStorage.setItem(this.SAVED_BOOKINGS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing saved booking:', error);
      throw error;
    }
  }

  /**
   * Get booking statistics
   */
  async getBookingStats() {
    const history = await this.getBookingHistory();
    
    const stats = {
      total: history.length,
      byType: {
        flights: 0,
        hotels: 0,
        activities: 0
      },
      byStatus: {
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0
      },
      totalSpent: 0,
      averageSpent: 0
    };

    history.forEach(booking => {
      // Count by type
      if (booking.type === 'flight') stats.byType.flights++;
      else if (booking.type === 'hotel') stats.byType.hotels++;
      else if (booking.type === 'activity') stats.byType.activities++;

      // Count by status
      if (stats.byStatus[booking.status] !== undefined) {
        stats.byStatus[booking.status]++;
      }

      // Calculate spending
      if (booking.price && booking.price.amount) {
        stats.totalSpent += booking.price.amount;
      }
    });

    stats.averageSpent = stats.total > 0 ? stats.totalSpent / stats.total : 0;

    return stats;
  }

  /**
   * Clear all booking history
   */
  async clearHistory() {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }

  /**
   * Export booking history to JSON
   */
  async exportHistory() {
    const history = await this.getBookingHistory();
    return JSON.stringify(history, null, 2);
  }
}

export default new BookingHistoryService();