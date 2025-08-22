// Authentication Configuration
// Replace these with your actual OAuth credentials

export const AUTH_CONFIG = {
  // Google OAuth
  google: {
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  },
  
  // Facebook OAuth
  facebook: {
    appId: 'YOUR_FACEBOOK_APP_ID',
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.roamly.com',
    timeout: 10000,
  },
};

// Instructions for setting up OAuth:

// Google OAuth Setup:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Google Sign-In API
// 4. Create OAuth 2.0 credentials for iOS, Android, and Web
// 5. Add the client IDs above

// Facebook OAuth Setup:
// 1. Go to https://developers.facebook.com/
// 2. Create a new app or select existing
// 3. Add Facebook Login product
// 4. Configure OAuth redirect URIs
// 5. Add the App ID above

// Apple Sign In Setup:
// 1. Enable Sign In with Apple in your Apple Developer account
// 2. Configure Sign In with Apple for your app ID
// 3. No additional configuration needed in this file