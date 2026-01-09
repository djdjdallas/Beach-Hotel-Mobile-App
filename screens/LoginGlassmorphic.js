import React, { useLayoutEffect, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageBackground,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { 
  SparklesIcon,
  GlobeAltIcon,
  MapIcon,
  StarIcon,
} from "react-native-heroicons/outline";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const navigation = useNavigation();
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    // Floating animation for background elements
    const createFloatingAnimation = (animValue, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(floatingAnim1, 4000).start();
    createFloatingAnimation(floatingAnim2, 5000).start();
    createFloatingAnimation(floatingAnim3, 6000).start();
  }, []);

  const translateY1 = floatingAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const translateY2 = floatingAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const translateY3 = floatingAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background with multiple images for parallax effect */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200' }}
        style={styles.backgroundImage}
        blurRadius={0}
      >
        {/* Animated floating elements */}
        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement1,
            { transform: [{ translateY: translateY1 }] }
          ]}
        >
          <BlurView intensity={70} tint="light" style={styles.floatingBlur}>
            <StarIcon size={30} color="rgba(255,255,255,0.6)" />
          </BlurView>
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement2,
            { transform: [{ translateY: translateY2 }] }
          ]}
        >
          <BlurView intensity={60} tint="light" style={styles.floatingBlur}>
            <MapIcon size={40} color="rgba(105,220,158,0.6)" />
          </BlurView>
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement3,
            { transform: [{ translateY: translateY3 }] }
          ]}
        >
          <BlurView intensity={50} tint="light" style={styles.floatingBlur}>
            <GlobeAltIcon size={35} color="rgba(255,255,255,0.5)" />
          </BlurView>
        </Animated.View>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {/* Content Container */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Logo Section with Advanced Glassmorphism */}
            <Animatable.View 
              animation="zoomIn" 
              duration={1200}
              style={styles.logoSection}
            >
              <BlurView intensity={40} tint="light" style={styles.logoBlur}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                  style={styles.logoGradient}
                >
                  <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                      <LinearGradient
                        colors={['#69DC9E', '#4FBB82']}
                        style={styles.logoCircleGradient}
                      >
                        <Text style={styles.logoText}>R</Text>
                      </LinearGradient>
                    </View>
                    <View>
                      <Text style={styles.logoMainText}>oamly</Text>
                      <Text style={styles.logoSubText}>Travel Redefined</Text>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </Animatable.View>

            {/* Tagline Section with Glass Card */}
            <Animatable.View 
              animation="fadeInUp" 
              delay={400}
              duration={1000}
              style={styles.taglineSection}
            >
              <BlurView intensity={30} tint="light" style={styles.taglineBlur}>
                <Text style={styles.tagline}>Discover Your Next</Text>
                <Animatable.Text 
                  animation="pulse" 
                  iterationCount="infinite"
                  duration={2000}
                  style={[styles.tagline, styles.taglineHighlight]}
                >
                  Adventure
                </Animatable.Text>
                <Text style={styles.description}>
                  Seamless travel planning with AI-powered recommendations
                </Text>
              </BlurView>
            </Animatable.View>

            {/* Stats Section */}
            <Animatable.View 
              animation="fadeInUp" 
              delay={600}
              duration={1000}
              style={styles.statsSection}
            >
              <View style={styles.stat}>
                <Text style={styles.statNumber}>2M+</Text>
                <Text style={styles.statLabel}>Travelers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>150+</Text>
                <Text style={styles.statLabel}>Countries</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statNumber}>4.9★</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </Animatable.View>

            {/* CTA Buttons */}
            <Animatable.View 
              animation="fadeInUp" 
              delay={800}
              duration={1000}
              style={styles.ctaSection}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("LoginScreen")}
                style={styles.primaryButton}
              >
                <LinearGradient
                  colors={['#69DC9E', '#4FBB82']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.secondaryButton}
              >
                <BlurView intensity={40} tint="light" style={styles.secondaryButtonBlur}>
                  <Text style={styles.secondaryButtonText}>Explore as Guest</Text>
                </BlurView>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
  },
  floatingElement1: {
    top: 100,
    right: 50,
  },
  floatingElement2: {
    top: 300,
    left: 30,
  },
  floatingElement3: {
    bottom: 200,
    right: 40,
  },
  floatingBlur: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  logoGradient: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
  },
  logoCircleGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logoMainText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logoSubText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  taglineSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  taglineBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagline: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '300',
  },
  taglineHighlight: {
    fontSize: 36,
    color: '#69DC9E',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    color: '#69DC9E',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ctaSection: {
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    marginBottom: 16,
  },
  primaryButtonGradient: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
  },
  secondaryButtonBlur: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Login;