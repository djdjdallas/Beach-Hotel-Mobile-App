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
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { 
  EyeIcon, 
  EyeSlashIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from 'react-native-heroicons/outline';
import { useAuth } from '../contexts/AuthContext';
import { useSocialAuth } from '../hooks/useSocialAuth';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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

    try {
      await login(email, password);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
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
      
      if (result.success) {
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const isLoading = authLoading || socialLoading;

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200' }}
      style={{ flex: 1 }}
      blurRadius={0}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ 
                  position: 'absolute',
                  top: 60,
                  left: 20,
                  zIndex: 10,
                }}
              >
                <BlurView intensity={20} tint="light" style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }}>
                  <ArrowLeftIcon size={24} color="white" />
                </BlurView>
              </TouchableOpacity>

              <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
                {/* Header */}
                <Animatable.View animation="fadeInDown" duration={1000}>
                  <Text style={{
                    fontSize: 36,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: 8,
                  }}>
                    Welcome Back
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.7)',
                    textAlign: 'center',
                    marginBottom: 40,
                  }}>
                    Sign in to continue your journey
                  </Text>
                </Animatable.View>

                {/* Form Container */}
                <Animatable.View animation="fadeInUp" delay={200} duration={1000}>
                  <BlurView intensity={25} tint="light" style={{
                    borderRadius: 24,
                    overflow: 'hidden',
                    padding: 24,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}>
                    {/* Email Input */}
                    <View style={{ marginBottom: 20 }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: errors.email ? '#EF4444' : 'rgba(255,255,255,0.2)',
                      }}>
                        <EnvelopeIcon size={20} color="rgba(255,255,255,0.6)" />
                        <TextInput
                          placeholder="Email"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={{
                            flex: 1,
                            paddingVertical: 16,
                            paddingHorizontal: 12,
                            color: 'white',
                            fontSize: 16,
                          }}
                        />
                      </View>
                      {errors.email && (
                        <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>
                          {errors.email}
                        </Text>
                      )}
                    </View>

                    {/* Password Input */}
                    <View style={{ marginBottom: 24 }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        borderWidth: 1,
                        borderColor: errors.password ? '#EF4444' : 'rgba(255,255,255,0.2)',
                      }}>
                        <LockClosedIcon size={20} color="rgba(255,255,255,0.6)" />
                        <TextInput
                          placeholder="Password"
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                          style={{
                            flex: 1,
                            paddingVertical: 16,
                            paddingHorizontal: 12,
                            color: 'white',
                            fontSize: 16,
                          }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <EyeSlashIcon size={20} color="rgba(255,255,255,0.6)" />
                          ) : (
                            <EyeIcon size={20} color="rgba(255,255,255,0.6)" />
                          )}
                        </TouchableOpacity>
                      </View>
                      {errors.password && (
                        <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 }}>
                          {errors.password}
                        </Text>
                      )}
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ForgotPassword')}
                      style={{ alignSelf: 'flex-end', marginBottom: 24 }}
                    >
                      <Text style={{ color: '#69DC9E', fontSize: 14 }}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                      onPress={handleLogin}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#69DC9E', '#4FBB82']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          paddingVertical: 16,
                          borderRadius: 16,
                          alignItems: 'center',
                        }}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                            Sign In
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </BlurView>
                </Animatable.View>

                {/* Social Login */}
                <Animatable.View animation="fadeInUp" delay={400} duration={1000}>
                  <View style={{ marginTop: 32 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                      <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                      <Text style={{ color: 'rgba(255,255,255,0.6)', marginHorizontal: 16 }}>
                        Or continue with
                      </Text>
                      <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
                      {/* Google */}
                      <TouchableOpacity
                        onPress={() => handleSocialLogin('google')}
                        disabled={isLoading}
                      >
                        <BlurView intensity={20} tint="light" style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.2)',
                        }}>
                          <Text style={{ fontSize: 24 }}>G</Text>
                        </BlurView>
                      </TouchableOpacity>

                      {/* Facebook */}
                      <TouchableOpacity
                        onPress={() => handleSocialLogin('facebook')}
                        disabled={isLoading}
                      >
                        <BlurView intensity={20} tint="light" style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.2)',
                        }}>
                          <Text style={{ fontSize: 24 }}>f</Text>
                        </BlurView>
                      </TouchableOpacity>

                      {/* Apple */}
                      {showAppleSignIn && (
                        <TouchableOpacity
                          onPress={() => handleSocialLogin('apple')}
                          disabled={isLoading}
                        >
                          <BlurView intensity={20} tint="light" style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                          }}>
                            <Text style={{ fontSize: 24 }}>🍎</Text>
                          </BlurView>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Sign Up Link */}
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                      Don't have an account? 
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                      <Text style={{ color: '#69DC9E', fontWeight: 'bold' }}>
                        {' '}Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animatable.View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default LoginScreen;