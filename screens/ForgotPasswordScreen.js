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
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import authService from '../services/authService';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
      },
    });
  }, [navigation]);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      setError('');
      
      await authService.forgotPassword(email);
      setEmailSent(true);
      
      Alert.alert(
        'Email Sent',
        'We have sent you an email with instructions to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <View className="mt-8">
            <Text className="text-3xl font-bold text-[#0c0c0c]">Forgot Password?</Text>
            <Text className="text-gray-600 mt-4">
              No worries! Enter your email address below and we'll send you instructions to reset your password.
            </Text>
          </View>

          {/* Form */}
          <View className="mt-8">
            <Text className="text-gray-700 mb-2">Email Address</Text>
            <TextInput
              className={`bg-gray-100 px-4 py-3 rounded-lg ${error ? 'border border-red-500' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!emailSent}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            className={`mt-6 py-4 rounded-lg items-center ${
              emailSent ? 'bg-gray-300' : 'bg-[#69DC9E]'
            }`}
            onPress={handleResetPassword}
            disabled={isLoading || emailSent}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                {emailSent ? 'Email Sent' : 'Send Reset Instructions'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            className="mt-6 items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-[#69DC9E] font-medium">Back to Login</Text>
          </TouchableOpacity>

          {/* Resend Email */}
          {emailSent && (
            <View className="mt-auto mb-8">
              <Text className="text-center text-gray-600 mb-4">
                Didn't receive the email? Check your spam folder or
              </Text>
              <TouchableOpacity
                className="items-center"
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
              >
                <Text className="text-[#69DC9E] font-medium">Try another email address</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;