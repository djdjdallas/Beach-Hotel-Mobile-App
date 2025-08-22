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
import * as Animatable from 'react-native-animatable';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSocialAuth } from '../hooks/useSocialAuth';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading: authLoading } = useAuth();
  const { signInWithGoogle, signInWithFacebook, signInWithApple, isAppleSignInAvailable, isLoading: socialLoading } = useSocialAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    const result = await login(email, password);
    
    if (result.success) {
      navigation.replace('Home');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleSocialLogin = async (provider) => {
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
      Alert.alert('Login Failed', result.error);
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
          <View className="flex-row mt-8 ml-3 items-center">
            <View className="bg-[#0c0c0c] h-24 w-24 rounded-full justify-center items-center">
              <Text
                style={{ fontFamily: 'Baskerville', fontSize: 30 }}
                className="font-bold text-[#69DC9E] p-1"
              >
                Roam
              </Text>
            </View>
            <Text
              style={{ fontFamily: 'Baskerville', fontSize: 30 }}
              className="ml-1 text-[#000000] font-semibold"
            >
              ly
            </Text>
          </View>

          {/* Welcome Text */}
          <View className="mt-6 px-6">
            <Text className="text-3xl font-bold text-[#0c0c0c]">Welcome Back!</Text>
            <Text className="text-gray-600 mt-2">Sign in to continue your journey</Text>
          </View>

          {/* Form Section */}
          <View className="px-6 mt-8">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Email</Text>
              <TextInput
                className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.email ? 'border border-red-500' : ''}`}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2">Password</Text>
              <View className="relative">
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg pr-12 ${errors.password ? 'border border-red-500' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
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

            {/* Forgot Password */}
            <TouchableOpacity className="mb-6" onPress={() => navigation.navigate('ForgotPassword')}>
              <Text className="text-[#69DC9E] text-right">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-[#69DC9E] py-4 rounded-lg items-center mb-4"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Or Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              className="border border-gray-300 py-4 rounded-lg items-center mb-3 flex-row justify-center"
              onPress={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-medium">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-300 py-4 rounded-lg items-center mb-3 flex-row justify-center"
              onPress={() => handleSocialLogin('facebook')}
              disabled={isLoading}
            >
              <Text className="text-gray-700 font-medium">Continue with Facebook</Text>
            </TouchableOpacity>

            {showAppleSignIn && (
              <TouchableOpacity
                className="bg-black py-4 rounded-lg items-center mb-3 flex-row justify-center"
                onPress={() => handleSocialLogin('apple')}
                disabled={isLoading}
              >
                <Text className="text-white font-medium">Continue with Apple</Text>
              </TouchableOpacity>
            )}

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="text-[#69DC9E] font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Skip for now */}
          <TouchableOpacity
            className="items-center mt-auto mb-6"
            onPress={() => navigation.navigate('Home')}
          >
            <Text className="text-gray-500 underline">Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;