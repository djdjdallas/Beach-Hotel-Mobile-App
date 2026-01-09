import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_CONFIG } from '../config/auth.config';

WebBrowser.maybeCompleteAuthSession();

export const useSocialAuth = () => {
  const { socialLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Google Auth
  const [googleRequest, googleResponse, googlePromptAsync] = Google?.useAuthRequest ? 
    Google.useAuthRequest({
      expoClientId: AUTH_CONFIG.google.expoClientId,
      iosClientId: AUTH_CONFIG.google.iosClientId,
      androidClientId: AUTH_CONFIG.google.androidClientId,
      webClientId: AUTH_CONFIG.google.webClientId,
    }) : [null, null, () => {}];

  // Facebook Auth
  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook?.useAuthRequest ? 
    Facebook.useAuthRequest({
      clientId: AUTH_CONFIG.facebook.appId,
      responseType: 'token',
    }) : [null, null, () => {}];

  // Handle Google response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      handleSocialLogin('google', authentication?.accessToken);
    }
  }, [googleResponse]);

  // Handle Facebook response
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      handleSocialLogin('facebook', authentication?.accessToken);
    }
  }, [facebookResponse]);

  const handleSocialLogin = async (provider, accessToken) => {
    try {
      setIsLoading(true);
      const result = await socialLogin(provider, accessToken);
      return result;
    } catch (error) {
      console.error('Social login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await googlePromptAsync();
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setIsLoading(true);
      await facebookPromptAsync();
    } catch (error) {
      console.error('Facebook sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      return { success: false, error: 'Apple Sign In is only available on iOS' };
    }

    try {
      setIsLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Apple returns an identityToken instead of accessToken
      const result = await socialLogin('apple', credential.identityToken);
      return result;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return { success: false, error: 'Sign in cancelled' };
      }
      console.error('Apple sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const isAppleSignInAvailable = async () => {
    if (Platform.OS !== 'ios') return false;
    return await AppleAuthentication.isAvailableAsync();
  };

  return {
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    isAppleSignInAvailable,
    isLoading,
  };
};