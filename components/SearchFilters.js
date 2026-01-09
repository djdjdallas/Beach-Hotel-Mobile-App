import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { Slider } from '@rneui/themed';

const SearchFilters = ({ filters, onFiltersChange, onClose, visible }) => {
  const [localFilters, setLocalFilters] = useState(filters || {
    minRating: 0,
    priceLevel: [],
    openNow: false,
    maxDistance: 10,
    sortBy: 'relevance',
  });

  const priceLevels = [
    { value: '$', label: '$' },
    { value: '$$', label: '$$' },
    { value: '$$$', label: '$$$' },
    { value: '$$$$', label: '$$$$' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Rating' },
    { value: 'reviews', label: 'Most Reviewed' },
    { value: 'distance', label: 'Distance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  const handlePriceLevelToggle = (level) => {
    const currentLevels = localFilters.priceLevel || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level];
    
    setLocalFilters({ ...localFilters, priceLevel: newLevels });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      minRating: 0,
      priceLevel: [],
      openNow: false,
      maxDistance: 10,
      sortBy: 'relevance',
    };
    setLocalFilters(resetFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters & Sort</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" type="material" color="#333" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Sort By */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      localFilters.sortBy === option.value && styles.sortOptionActive,
                    ]}
                    onPress={() => setLocalFilters({ ...localFilters, sortBy: option.value })}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        localFilters.sortBy === option.value && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setLocalFilters({ ...localFilters, minRating: star })}
                    >
                      <Icon
                        name="star"
                        type="material"
                        color={star <= localFilters.minRating ? '#FFD700' : '#E0E0E0'}
                        size={30}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {localFilters.minRating > 0 ? `${localFilters.minRating}+ stars` : 'Any rating'}
                </Text>
              </View>
            </View>

            {/* Price Level Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Level</Text>
              <View style={styles.priceOptions}>
                {priceLevels.map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.priceOption,
                      localFilters.priceLevel.includes(level.value) && styles.priceOptionActive,
                    ]}
                    onPress={() => handlePriceLevelToggle(level.value)}
                  >
                    <Text
                      style={[
                        styles.priceOptionText,
                        localFilters.priceLevel.includes(level.value) && styles.priceOptionTextActive,
                      ]}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Distance Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Maximum Distance: {localFilters.maxDistance}km
              </Text>
              <Slider
                value={localFilters.maxDistance}
                onValueChange={(value) => setLocalFilters({ ...localFilters, maxDistance: value })}
                minimumValue={1}
                maximumValue={50}
                step={1}
                thumbStyle={styles.sliderThumb}
                trackStyle={styles.sliderTrack}
                minimumTrackTintColor="#69DC9E"
                maximumTrackTintColor="#E0E0E0"
              />
            </View>

            {/* Open Now Filter */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.openNowContainer}
                onPress={() => setLocalFilters({ ...localFilters, openNow: !localFilters.openNow })}
              >
                <Text style={styles.sectionTitle}>Open Now</Text>
                <Icon
                  name={localFilters.openNow ? 'check-box' : 'check-box-outline-blank'}
                  type="material"
                  color={localFilters.openNow ? '#69DC9E' : '#666'}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  sortOption: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  sortOptionActive: {
    backgroundColor: '#69DC9E',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  sortOptionTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  priceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceOption: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  priceOptionActive: {
    backgroundColor: '#69DC9E',
  },
  priceOptionText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  priceOptionTextActive: {
    color: 'white',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#69DC9E',
  },
  sliderTrack: {
    height: 5,
    borderRadius: 3,
  },
  openNowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#69DC9E',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
});

export default SearchFilters;