import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeftIcon,
  MapPinIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  CheckCircleIcon,
  WifiIcon,
  SparklesIcon,
  FireIcon,
  TvIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
} from "react-native-heroicons/outline";
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from "react-native-heroicons/solid";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PromoCard = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.data || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // Sample images for gallery
  const images = [
    data.image,
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400',
    'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=400',
  ];

  // Amenities icons mapping
  const amenityIcons = {
    'WiFi': WifiIcon,
    'Pool': SparklesIcon,
    'Spa': SparklesIcon,
    'Restaurant': FireIcon,
    'Beach': SparklesIcon,
    'Bar': FireIcon,
    'Mountain View': BuildingOfficeIcon,
    'Fireplace': FireIcon,
    'TV': TvIcon,
  };

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Amazing experience! The staff was incredibly helpful and the location was perfect.',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Mike Chen',
      rating: 4,
      date: '1 month ago',
      comment: 'Great place to stay. Very clean and comfortable. Would definitely come back.',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Emma Davis',
      rating: 5,
      date: '2 months ago',
      comment: 'Exceeded all expectations! Beautiful views and excellent service.',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ];

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => setSelectedImage(index)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item }}
        className="w-24 h-24 rounded-xl mr-2"
      />
      {selectedImage === index && (
        <View className="absolute inset-0 rounded-xl border-2 border-[#69DC9E]" />
      )}
    </TouchableOpacity>
  );

  const renderReview = ({ item }) => (
    <View className="bg-white p-4 rounded-2xl mb-3 shadow-sm">
      <View className="flex-row items-start">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-bold text-gray-900">{item.name}</Text>
            <Text className="text-gray-500 text-xs">{item.date}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIconSolid
                key={i}
                size={14}
                color={i < item.rating ? '#FFC107' : '#E5E7EB'}
              />
            ))}
          </View>
          <Text className="text-gray-600 text-sm leading-5">{item.comment}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image Section */}
        <View className="relative">
          <Image
            source={{ uri: images[selectedImage] }}
            className="w-full h-80"
            style={{ height: screenHeight * 0.4 }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
          
          {/* Header Actions */}
          <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-5">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-white/90 p-3 rounded-full shadow-lg"
            >
              <ArrowLeftIcon size={20} color="#1F2937" />
            </TouchableOpacity>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setIsFavorite(!isFavorite)}
                className="bg-white/90 p-3 rounded-full shadow-lg"
              >
                {isFavorite ? (
                  <HeartIconSolid size={20} color="#EF4444" />
                ) : (
                  <HeartIcon size={20} color="#1F2937" />
                )}
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/90 p-3 rounded-full shadow-lg">
                <ShareIcon size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Image Gallery */}
        <View className="px-5 -mt-8 mb-4">
          <FlatList
            data={images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Content Section */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          className="bg-white rounded-t-3xl -mt-4 pt-6"
        >
          {/* Title & Basic Info */}
          <View className="px-5">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {data.name}
                </Text>
                <View className="flex-row items-center">
                  <MapPinIcon size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1 flex-1" numberOfLines={1}>
                    {data.location || data.distance}
                  </Text>
                </View>
              </View>
              {data.price && (
                <View className="items-end">
                  <Text className="text-2xl font-bold text-[#69DC9E]">
                    {data.price}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {data.type === 'hotels' ? 'per night' : ''}
                  </Text>
                </View>
              )}
            </View>

            {/* Rating & Status */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <View className="bg-[#69DC9E] px-3 py-1.5 rounded-full flex-row items-center mr-3">
                  <StarIconSolid size={16} color="white" />
                  <Text className="text-white font-bold ml-1">{data.rating}</Text>
                </View>
                <Text className="text-gray-600">
                  {data.reviews} reviews
                </Text>
              </View>
              
              {data.openNow !== undefined && (
                <View className="flex-row items-center">
                  <ClockIcon 
                    size={16} 
                    color={data.openNow ? '#10B981' : '#EF4444'} 
                  />
                  <Text className={`ml-1 font-medium ${
                    data.openNow ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.openNow ? 'Open Now' : 'Closed'}
                  </Text>
                </View>
              )}
            </View>

            {/* Amenities/Features */}
            {data.amenities && (
              <View className="py-4">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  Amenities
                </Text>
                <View className="flex-row flex-wrap -mx-1">
                  {data.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || CheckCircleIcon;
                    return (
                      <View 
                        key={index} 
                        className="bg-gray-50 rounded-xl px-4 py-3 m-1 flex-row items-center"
                      >
                        <Icon size={18} color="#6B7280" />
                        <Text className="text-gray-700 ml-2">{amenity}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Description */}
            <View className="py-4">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                About
              </Text>
              <Text className="text-gray-600 leading-6">
                {data.type === 'hotels' 
                  ? 'Experience luxury and comfort at its finest. Our establishment offers world-class amenities and exceptional service to make your stay unforgettable. Located in the heart of the city with easy access to major attractions.'
                  : data.type === 'restaurants'
                  ? `Savor the finest ${data.cuisine || 'international'} cuisine in an elegant setting. Our expert chefs use only the freshest ingredients to create memorable dining experiences.`
                  : 'Discover one of the most popular destinations in the area. Perfect for visitors of all ages with plenty to see and explore.'
                }
              </Text>
            </View>

            {/* Reviews Section */}
            <View className="py-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-900">
                  Reviews
                </Text>
                <TouchableOpacity>
                  <Text className="text-[#69DC9E] font-medium">See all</Text>
                </TouchableOpacity>
              </View>
              {reviews.map((review) => renderReview({ item: review }))}
            </View>

            {/* Location */}
            <View className="py-4">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Location
              </Text>
              <TouchableOpacity className="bg-gray-100 rounded-2xl p-4 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <MapPinIcon size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-3 flex-1" numberOfLines={2}>
                    123 Main Street, Downtown District, New York, NY 10001
                  </Text>
                </View>
                <Text className="text-[#69DC9E] font-medium ml-2">View</Text>
              </TouchableOpacity>
            </View>

            {/* Contact Information */}
            <View className="py-4 mb-20">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Contact
              </Text>
              <View className="space-y-3">
                <TouchableOpacity className="flex-row items-center">
                  <View className="bg-gray-100 p-3 rounded-full mr-3">
                    <PhoneIcon size={20} color="#6B7280" />
                  </View>
                  <Text className="text-gray-700">+1 (555) 123-4567</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <View className="bg-gray-100 p-3 rounded-full mr-3">
                    <GlobeAltIcon size={20} color="#6B7280" />
                  </View>
                  <Text className="text-gray-700">www.{data.name?.toLowerCase().replace(/\s+/g, '')}.com</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row items-center justify-between px-5 py-4">
          <View>
            <Text className="text-gray-500 text-sm">
              {data.type === 'hotels' ? 'From' : 'Average'}
            </Text>
            <Text className="text-2xl font-bold text-gray-900">
              {data.price || 'Contact'}
            </Text>
          </View>
          <TouchableOpacity 
            className="bg-[#69DC9E] px-8 py-4 rounded-2xl flex-row items-center"
            style={{
              shadowColor: '#69DC9E',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white font-bold text-lg">
              {data.type === 'hotels' ? 'Book Now' : 
               data.type === 'restaurants' ? 'Reserve Table' : 
               'Get Tickets'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PromoCard;