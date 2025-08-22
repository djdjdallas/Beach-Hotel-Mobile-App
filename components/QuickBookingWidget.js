import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const QuickBookingWidget = ({ location, type = 'hotels' }) => {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('checkin');
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState({ adults: 1, children: 0, rooms: 1 });
  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (datePickerMode === 'checkin') {
        setCheckIn(selectedDate);
        // Ensure checkout is after checkin
        if (selectedDate >= checkOut) {
          setCheckOut(new Date(selectedDate.getTime() + 86400000));
        }
      } else {
        setCheckOut(selectedDate);
      }
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSearch = () => {
    if (!location) {
      alert('Please select a location first');
      return;
    }

    if (type === 'hotels') {
      navigation.navigate('HotelSearch', {
        location,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests,
      });
    } else {
      // Flight search implementation
      navigation.navigate('FlightSearch', {
        origin: location,
        destination: null,
        departureDate: checkIn.toISOString().split('T')[0],
        returnDate: checkOut.toISOString().split('T')[0],
        passengers: { adults: guests.adults, class: 'ECONOMY' },
      });
    }
  };

  const updateGuests = (type, increment) => {
    setGuests(prev => {
      const newValue = prev[type] + increment;
      if (newValue >= 0) {
        if (type === 'adults' && newValue === 0 && prev.children === 0) {
          return prev; // At least one adult or child required
        }
        return { ...prev, [type]: newValue };
      }
      return prev;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setDatePickerMode('checkin');
            setShowDatePicker(true);
          }}
        >
          <Icon name="calendar-today" type="material" size={20} color="#69DC9E" />
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{formatDate(checkIn)}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.dateSeparator} />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setDatePickerMode('checkout');
            setShowDatePicker(true);
          }}
        >
          <Icon name="calendar-today" type="material" size={20} color="#69DC9E" />
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.dateValue}>{formatDate(checkOut)}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.guestButton}
        onPress={() => setShowGuestModal(true)}
      >
        <Icon name="person" type="material" size={20} color="#69DC9E" />
        <Text style={styles.guestText}>
          {guests.adults} Adult{guests.adults !== 1 ? 's' : ''}
          {guests.children > 0 && `, ${guests.children} Child${guests.children !== 1 ? 'ren' : ''}`}
          {type === 'hotels' && `, ${guests.rooms} Room${guests.rooms !== 1 ? 's' : ''}`}
        </Text>
        <Icon name="expand-more" type="material" size={20} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>
          Search {type === 'hotels' ? 'Hotels' : 'Flights'}
        </Text>
        <Icon name="search" type="material" size={20} color="white" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'checkin' ? checkIn : checkOut}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={datePickerMode === 'checkin' ? new Date() : checkIn}
        />
      )}

      <Modal
        visible={showGuestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Guests & Rooms</Text>
              <TouchableOpacity onPress={() => setShowGuestModal(false)}>
                <Icon name="close" type="material" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Adults</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateGuests('adults', -1)}
                >
                  <Icon name="remove" type="material" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests.adults}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateGuests('adults', 1)}
                >
                  <Icon name="add" type="material" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Children</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateGuests('children', -1)}
                >
                  <Icon name="remove" type="material" size={20} color="#666" />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests.children}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => updateGuests('children', 1)}
                >
                  <Icon name="add" type="material" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {type === 'hotels' && (
              <View style={styles.guestRow}>
                <Text style={styles.guestLabel}>Rooms</Text>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => updateGuests('rooms', -1)}
                  >
                    <Icon name="remove" type="material" size={20} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{guests.rooms}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => updateGuests('rooms', 1)}
                  >
                    <Icon name="add" type="material" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowGuestModal(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dateSeparator: {
    width: 10,
  },
  dateInfo: {
    marginLeft: 10,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 15,
  },
  guestText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#69DC9E',
    paddingVertical: 15,
    borderRadius: 25,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  guestLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  doneButton: {
    backgroundColor: '#69DC9E',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
});

export default QuickBookingWidget;