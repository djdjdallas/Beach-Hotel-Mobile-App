# Authentication System Setup Guide

This guide will help you set up the complete authentication system for the Roamly app.

## Overview

The authentication system includes:
- Email/Password authentication
- Social login (Google, Facebook, Apple)
- User profile management
- Secure token storage
- Protected routes
- User data persistence

## Components

### 1. Auth Context (`/contexts/AuthContext.js`)
Manages the global authentication state and provides auth methods:
- `login(email, password)`
- `signup(userData)`
- `socialLogin(provider, token)`
- `logout()`
- `updateUser(updates)`

### 2. Auth Service (`/services/authService.js`)
Handles all API calls related to authentication:
- Login/Signup
- Social authentication
- Token management
- Profile updates

### 3. Social Auth Hook (`/hooks/useSocialAuth.js`)
Manages social authentication providers:
- Google Sign In
- Facebook Login
- Apple Sign In (iOS only)

### 4. Screens
- **LoginScreen**: Main login interface with social options
- **SignupScreen**: User registration
- **ProfileScreen**: User profile management
- **SettingsScreen**: App settings and preferences
- **ForgotPasswordScreen**: Password recovery

### 5. Protected Routes
The `ProtectedRoute` component ensures only authenticated users can access certain screens.

## Setup Instructions

### 1. Configure OAuth Providers

Edit `/config/auth.config.js` with your OAuth credentials:

```javascript
export const AUTH_CONFIG = {
  google: {
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  },
  facebook: {
    appId: 'YOUR_FACEBOOK_APP_ID',
  },
  api: {
    baseUrl: 'YOUR_API_BASE_URL',
    timeout: 10000,
  },
};
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sign-In API
4. Create OAuth 2.0 credentials:
   - Web application (for Expo Go)
   - iOS application
   - Android application
5. Add authorized redirect URIs for Expo
6. Copy the client IDs to your config

### 3. Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs
5. Copy the App ID to your config

### 4. Apple Sign In Setup (iOS only)

1. Enable "Sign In with Apple" capability in your Apple Developer account
2. Configure Sign In with Apple for your app ID
3. Add the capability to your app in Xcode

### 5. Backend API Requirements

Your backend API should implement these endpoints:

```
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/social
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
PUT /api/users/profile
POST /api/users/change-password
DELETE /api/users/account
```

### 6. Environment Setup

For React Native with Expo, you can use the `.env` file:

```env
API_BASE_URL=https://your-api-url.com
```

## Usage

### Login with Email/Password

```javascript
const { login } = useAuth();

const result = await login(email, password);
if (result.success) {
  // Navigate to home
} else {
  // Show error: result.error
}
```

### Social Login

```javascript
const { signInWithGoogle } = useSocialAuth();

const result = await signInWithGoogle();
if (result?.success) {
  // Navigate to home
}
```

### Check Authentication Status

```javascript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  // User is logged in
  console.log('Current user:', user);
}
```

### Logout

```javascript
const { logout } = useAuth();

await logout();
// User will be redirected to login screen
```

## Security Features

1. **Secure Token Storage**: Uses `react-native-keychain` for secure token storage
2. **Auto Token Refresh**: Automatically refreshes expired tokens
3. **Protected Routes**: Prevents unauthorized access to protected screens
4. **Input Validation**: Client-side validation for all forms
5. **Error Handling**: Comprehensive error handling and user feedback

## Testing

To test the authentication system:

1. Run the app: `npm start`
2. Try creating a new account
3. Test login with email/password
4. Test social login options
5. Verify protected routes redirect to login when not authenticated
6. Test logout functionality
7. Verify data persistence after app restart

## Troubleshooting

### Common Issues

1. **Social login not working in development**
   - Make sure you're using the correct client IDs
   - Check redirect URIs are properly configured
   - For iOS, ensure you've added URL schemes

2. **Token storage issues**
   - On iOS simulator, Keychain might not work properly
   - Test on real device for accurate behavior

3. **API connection errors**
   - Verify API base URL is correct
   - Check CORS settings on your backend
   - Ensure API endpoints match expected format

## Next Steps

1. Implement refresh token rotation
2. Add biometric authentication
3. Implement 2FA support
4. Add session management
5. Implement remember me functionality