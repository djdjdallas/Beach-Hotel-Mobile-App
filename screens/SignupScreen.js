import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSocialAuth } from '../hooks/useSocialAuth';

const SignupScreen = () => {
  const navigation = useNavigation();
  const { signup, isLoading: authLoading } = useAuth();
  const { signInWithGoogle, signInWithFacebook, signInWithApple, isAppleSignInAvailable, isLoading: socialLoading } = useSocialAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAppleSignIn, setShowAppleSignIn] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    
    // Check if Apple Sign In is available
    checkAppleSignIn();
  }, []);

  const checkAppleSignIn = async () => {
    const available = await isAppleSignInAvailable();
    setShowAppleSignIn(available);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    const result = await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
    
    if (result.success) {
      Alert.alert(
        'Success',
        'Your account has been created successfully!',
        [{ text: 'OK', onPress: () => navigation.replace('Home') }]
      );
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  const handleSocialSignup = async (provider) => {
    let result;
    
    switch (provider) {
      case 'google':
        result = await signInWithGoogle();
        break;
      case 'facebook':
        result = await signInWithFacebook();
        break;
      case 'apple':
        result = await signInWithApple();
        break;
    }
    
    if (result?.success) {
      navigation.replace('Home');
    } else if (result?.error) {
      Alert.alert('Signup Failed', result.error);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isLoading = authLoading || socialLoading;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Logo Section */}
          <View className="flex-row mt-6 ml-3 items-center">
            <View className="bg-[#0c0c0c] h-20 w-20 rounded-full justify-center items-center">
              <Text
                style={{ fontFamily: 'Baskerville', fontSize: 24 }}
                className="font-bold text-[#69DC9E] p-1"
              >
                Roam
              </Text>
            </View>
            <Text
              style={{ fontFamily: 'Baskerville', fontSize: 24 }}
              className="ml-1 text-[#000000] font-semibold"
            >
              ly
            </Text>
          </View>

          {/* Welcome Text */}
          <View className="mt-4 px-6">
            <Text className="text-3xl font-bold text-[#0c0c0c]">Create Account</Text>
            <Text className="text-gray-600 mt-2">Start your journey with Roamly</Text>
          </View>

          {/* Form Section */}
          <View className="px-6 mt-6">
            {/* Name Row */}
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-2">First Name</Text>
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.firstName ? 'border border-red-500' : ''}`}
                  placeholder="John"
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData('firstName', value)}
                />
                {errors.firstName && (
                  <Text className="text-red-500 text-sm mt-1">{errors.firstName}</Text>
                )}
              </View>
              
              <View className="flex-1 ml-2">
                <Text className="text-gray-700 mb-2">Last Name</Text>
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.lastName ? 'border border-red-500' : ''}`}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData('lastName', value)}
                />
                {errors.lastName && (
                  <Text className="text-red-500 text-sm mt-1">{errors.lastName}</Text>
                )}
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Email</Text>
              <TextInput
                className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.email ? 'border border-red-500' : ''}`}
                placeholder="john@example.com"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg pr-12 ${errors.password ? 'border border-red-500' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon size={24} color="#6B7280" />
                  ) : (
                    <EyeIcon size={24} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2">Confirm Password</Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg pr-12 ${errors.confirmPassword ? 'border border-red-500' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon size={24} color="#6B7280" />
                  ) : (
                    <EyeIcon size={24} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              className="bg-[#69DC9E] py-4 rounded-lg items-center mb-4"
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Or Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Social Signup Buttons */}
            <TouchableOpacity
              className="border border-gray-300 py-3 rounded-lg items-center mb-3 flex-row justify-center"
              onPress={() => handleSocialSignup('google')}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-medium">Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-300 py-3 rounded-lg items-center mb-3 flex-row justify-center"
              onPress={() => handleSocialSignup('facebook')}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-medium">Sign up with Facebook</Text>
            </TouchableOpacity>

            {showAppleSignIn && (
              <TouchableOpacity
                className="bg-black py-3 rounded-lg items-center mb-3 flex-row justify-center"
                onPress={() => handleSocialSignup('apple')}
                disabled={isLoading}
              >
                <Text className="text-white font-medium">Sign up with Apple</Text>
              </TouchableOpacity>
            )}

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text className="text-[#69DC9E] font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;