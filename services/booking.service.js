import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

class BookingService {
  constructor() {
    this.config = API_CONFIG.booking;
    this.headers = {
      'X-RapidAPI-Key': this.config.rapidAPIKey,
      'X-RapidAPI-Host': this.config.rapidAPIHost
    };
  }

  async makeRequest(endpoint, params = {}, method = 'GET') {
    try {
      const response = await axios({
        method,
        url: `${this.config.baseURL}${endpoint}`,
        params,
        headers: this.headers,
        timeout: API_CONFIG.common.timeout
      });

      return response.data;
    } catch (error) {
      console.error('Booking.com API request error:', error);
      throw this.handleError(error);
    }
  }

  async searchDestinations(query) {
    const endpoint = this.config.endpoints.destinations.search;
    const params = {
      query,
      languagecode: 'en-us'
    };

    const data = await this.makeRequest(endpoint, params);
    return this.transformDestinationData(data.data);
  }

  async searchHotels({ 
    destId, 
    destType = 'city',
    checkIn, 
    checkOut, 
    adults = 1, 
    children = 0,
    rooms = 1,
    priceMin,
    priceMax,
    categories,
    facilities,
    reviewScoreMin,
    sortBy = 'popularity',
    page = 1
  }) {
    const endpoint = this.config.endpoints.hotels.search;
    const params = {
      dest_id: destId,
      dest_type: destType,
      checkin_date: checkIn,
      checkout_date: checkOut,
      adults_number: adults,
      children_number: children,
      room_number: rooms,
      price_min: priceMin,
      price_max: priceMax,
      categories_filter: categories?.join(','),
      facilities_filter: facilities?.join(','),
      review_score_min: reviewScoreMin,
      order_by: sortBy,
      page_number: page,
      units: 'metric',
      temperature_unit: 'c',
      languagecode: 'en-us',
      currency_code: 'USD'
    };

    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    const data = await this.makeRequest(endpoint, params);
    return this.transformHotelSearchData(data.data);
  }

  async getHotelDetails(hotelId, checkIn, checkOut, adults = 1, children = 0) {
    const endpoint = this.config.endpoints.hotels.details;
    const params = {
      hotel_id: hotelId,
      checkin_date: checkIn,
      checkout_date: checkOut,
      adults_number: adults,
      children_number: children,
      languagecode: 'en-us',
      currency_code: 'USD'
    };

    const data = await this.makeRequest(endpoint, params);
    return this.transformHotelDetails(data.data);
  }

  async getHotelPhotos(hotelId, limit = 50) {
    const endpoint = this.config.endpoints.hotels.photos;
    const params = {
      hotel_id: hotelId,
      languagecode: 'en-us',
      limit
    };

    const data = await this.makeRequest(endpoint, params);
    return this.transformHotelPhotos(data.data);
  }

  async getHotelReviews(hotelId, page = 1, sortBy = 'most_relevant') {
    const endpoint = this.config.endpoints.hotels.reviews;
    const params = {
      hotel_id: hotelId,
      page_number: page,
      sort_type: sortBy,
      languagecode: 'en-us'
    };

    const data = await this.makeRequest(endpoint, params);
    return this.transformHotelReviews(data.data);
  }

  transformDestinationData(destinations) {
    return destinations.map(dest => ({
      id: dest.dest_id,
      type: dest.dest_type,
      name: dest.name,
      label: dest.label,
      country: dest.country,
      region: dest.region,
      cityName: dest.city_name,
      location: {
        latitude: dest.latitude,
        longitude: dest.longitude
      },
      hotelCount: dest.nr_hotels,
      imageUrl: dest.image_url
    }));
  }

  transformHotelSearchData(hotels) {
    return {
      results: hotels.hotels?.map(hotel => ({
        id: hotel.hotel_id,
        name: hotel.hotel_name,
        address: hotel.address,
        location: {
          latitude: hotel.latitude,
          longitude: hotel.longitude,
          distance: hotel.distance_to_center
        },
        price: {
          amount: hotel.min_total_price,
          currency: hotel.currency_code,
          originalAmount: hotel.composite_price_breakdown?.gross_amount_per_night?.value,
          discountPercentage: hotel.composite_price_breakdown?.discounted_amount?.discount_percentage
        },
        rating: {
          score: hotel.review_score,
          scoreWord: hotel.review_score_word,
          reviewCount: hotel.review_nr
        },
        stars: hotel.class,
        mainPhoto: {
          url: hotel.main_photo_url,
          urlMax: hotel.max_photo_url,
          url1440: hotel.max_1440_photo_url
        },
        facilities: hotel.facility_highlights?.map(f => ({
          id: f.id,
          name: f.name
        })),
        isFreeCancellable: hotel.is_free_cancellable,
        ribbons: hotel.ribbon_info,
        badges: hotel.badges,
        checkinTime: hotel.checkin?.from,
        checkoutTime: hotel.checkout?.until
      })) || [],
      totalResults: hotels.total_count_with_filters,
      page: hotels.page_number,
      sortOptions: hotels.sort
    };
  }

  transformHotelDetails(hotel) {
    return {
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      description: hotel.description,
      address: hotel.address,
      location: {
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        city: hotel.city,
        country: hotel.country_trans
      },
      rating: {
        score: hotel.review_score,
        scoreWord: hotel.review_score_word,
        reviewCount: hotel.review_nr
      },
      stars: hotel.class,
      photos: hotel.photos?.map(photo => ({
        url: photo.url_max,
        url1440: photo.url_1440,
        urlSquare: photo.url_square60
      })),
      facilities: hotel.hotel_facilities?.map(facility => ({
        id: facility.facility_id,
        name: facility.facility_name,
        groupName: facility.facility_group_name
      })),
      policies: {
        checkin: hotel.checkin,
        checkout: hotel.checkout,
        childrenAndBeds: hotel.children_and_beds_text,
        importantInfo: hotel.important_information
      },
      rooms: hotel.rooms,
      nearbyPlaces: hotel.hotel_nearby_places,
      languages: hotel.languages_spoken
    };
  }

  transformHotelPhotos(photos) {
    return photos.map(photo => ({
      id: photo.photo_id,
      url: photo.url_max,
      url1440: photo.url_1440,
      urlSquare: photo.url_square60,
      tags: photo.tags,
      caption: photo.ml_tags?.map(tag => tag.tag_name).join(', ')
    }));
  }

  transformHotelReviews(reviewData) {
    return {
      reviews: reviewData.reviews?.map(review => ({
        id: review.review_id,
        date: review.date,
        title: review.title,
        text: review.review_text,
        rating: review.average_score,
        reviewer: {
          name: review.reviewer_name,
          country: review.reviewer_country,
          reviewCount: review.reviewer_review_count
        },
        pros: review.pros,
        cons: review.cons,
        stayed: {
          date: review.stayed_date,
          nights: review.nights,
          roomType: review.room_name
        }
      })) || [],
      totalCount: reviewData.review_count,
      scoreBreakdown: reviewData.score_breakdown
    };
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Invalid API key. Please check your RapidAPI credentials.');
        case 429:
          return new Error('Rate limit exceeded. Please try again later.');
        case 400:
          return new Error(data.message || 'Invalid request parameters');
        case 404:
          return new Error('No results found');
        default:
          return new Error(data.message || 'An error occurred');
      }
    }
    
    return new Error('Network error. Please check your connection.');
  }
}

export default new BookingService();