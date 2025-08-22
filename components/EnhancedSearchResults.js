import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import searchService from '../services/searchService';
import locationService from '../services/locationService';

const EnhancedSearchResults = ({
  title,
  imgUrl,
  reviews,
  location,
  description,
  price,
  rating,
  data,
  type,
  short_description,
  ranking,
  lat,
  long,
  userLocation,
  index,
}) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [distance, setDistance] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
    calculateDistance();
  }, []);

  const checkFavoriteStatus = async () => {
    try {
      const placeId = data?.place_id || `${lat}-${long}`;
      const favStatus = await searchService.isFavorite(placeId);
      setIsFavorite(favStatus);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const calculateDistance = () => {
    if (userLocation && lat && long) {
      const dist = locationService.calculateDistance(
        userLocation.lat,
        userLocation.lng,
        parseFloat(lat),
        parseFloat(long)
      );
      setDistance(locationService.formatDistance(dist));
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      const placeData = {
        placeId: data?.place_id || `${lat}-${long}`,
        title,
        imgUrl,
        location,
        lat,
        long,
        rating,
        type,
      };
      
      await searchService.toggleFavorite(placeData);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getPriceDisplay = () => {
    if (!price) return null;
    return typeof price === 'string' ? price : '$'.repeat(price.length || 2);
  };

  const getRatingColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.5) return '#69DC9E';
    if (numRating >= 4.0) return '#90EE90';
    if (numRating >= 3.5) return '#FFD700';
    return '#FFA500';
  };

  const handlePress = () => {
    navigation.navigate('PromoCard', {
      param: {
        data,
        imgUrl,
        title,
        reviews,
        location,
        description,
        price,
        rating,
        type,
        short_description,
        ranking,
        lat,
        long,
        isFavorite,
      },
    });
  };

  const defaultImage = require('../assets/newsplash.png');

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      duration={600}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imageLoader}>
              <ActivityIndicator size="large" color="#69DC9E" />
            </View>
          )}
          <Image
            source={imageError || !imgUrl ? defaultImage : { uri: imgUrl }}
            style={styles.image}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
          >
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              type="material"
              color={isFavorite ? '#FF6B6B' : '#FFF'}
              size={24}
            />
          </TouchableOpacity>
          {distance && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {getPriceDisplay() && (
              <Text style={styles.price}>{getPriceDisplay()}</Text>
            )}
          </View>

          <View style={styles.locationRow}>
            <Icon
              name="location-on"
              type="material"
              color="#666"
              size={16}
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>

          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}

          <View style={styles.bottomRow}>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(rating) }]}>
              <Icon type="material" name="star" color="#FFF" size={16} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
            
            <Text style={styles.reviewsText}>
              {reviews} {parseInt(reviews) === 1 ? 'review' : 'reviews'}
            </Text>

            {ranking && (
              <Text style={styles.rankingText} numberOfLines={1}>
                {ranking}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  contentContainer: {
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#69DC9E',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
  rankingText: {
    fontSize: 12,
    color: '#999',
    flex: 1,
    textAlign: 'right',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Baskerville' : 'serif',
  },
});

export default EnhancedSearchResults;