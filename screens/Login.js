import { useLayoutEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageBackground,
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
} from "react-native-heroicons/outline";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Image */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200' }}
        style={styles.backgroundImage}
        blurRadius={1}
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(12,12,12,0.3)', 'rgba(12,12,12,0.7)', 'rgba(12,12,12,0.9)']}
          style={styles.gradient}
        />

        {/* Content Container */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Logo Section with Glassmorphism */}
            <Animatable.View 
              animation="fadeInDown" 
              duration={1000}
              style={styles.logoSection}
            >
              <BlurView intensity={25} tint="light" style={styles.logoBlur}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>Roam</Text>
                  </View>
                  <Text style={styles.logoSuffix}>ly</Text>
                </View>
              </BlurView>
            </Animatable.View>

            {/* Tagline Section */}
            <Animatable.View 
              animation="fadeInUp" 
              delay={300}
              duration={1000}
              style={styles.taglineSection}
            >
              <Text style={styles.tagline}>Explore the world,</Text>
              <Text style={[styles.tagline, styles.taglineHighlight]}>
                Roamly your way.
              </Text>
            </Animatable.View>

            {/* Features Section with Glassmorphism */}
            <Animatable.View 
              animation="fadeInUp" 
              delay={600}
              duration={1000}
              style={styles.featuresSection}
            >
              <BlurView intensity={20} tint="light" style={styles.featuresBlur}>
                <View style={styles.feature}>
                  <MapIcon size={24} color="#69DC9E" />
                  <Text style={styles.featureText}>Discover hidden gems</Text>
                </View>
                <View style={styles.feature}>
                  <GlobeAltIcon size={24} color="#69DC9E" />
                  <Text style={styles.featureText}>Plan perfect trips</Text>
                </View>
                <View style={styles.feature}>
                  <SparklesIcon size={24} color="#69DC9E" />
                  <Text style={styles.featureText}>Create memories</Text>
                </View>
              </BlurView>
            </Animatable.View>

            {/* CTA Button with Glassmorphism */}
            <Animatable.View 
              animation="fadeInUp" 
              delay={900}
              duration={1000}
              style={styles.ctaSection}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <BlurView intensity={30} tint="light" style={styles.ctaBlur}>
                  <LinearGradient
                    colors={['rgba(105,220,158,0.9)', 'rgba(105,220,158,0.7)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ctaGradient}
                  >
                    <Animatable.Text 
                      animation="pulse" 
                      iterationCount="infinite"
                      style={styles.ctaText}
                    >
                      Start Your Journey
                    </Animatable.Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.skipButton}
              >
                <BlurView intensity={20} tint="light" style={styles.skipBlur}>
                  <Text style={styles.skipText}>Skip for now</Text>
                </BlurView>
              </TouchableOpacity>
            </Animatable.View>

            {/* Bottom decoration */}
            <Animatable.View 
              animation="fadeIn" 
              delay={1200}
              style={styles.bottomDecoration}
            >
              <View style={styles.decorLine} />
              <Text style={styles.decorText}>Your adventure awaits</Text>
              <View style={styles.decorLine} />
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
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  logoSection: {
    marginTop: 60,
    alignItems: 'center',
  },
  logoBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(12,12,12,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#69DC9E',
  },
  logoText: {
    fontFamily: 'Baskerville',
    fontSize: 28,
    color: '#69DC9E',
    fontWeight: 'bold',
  },
  logoSuffix: {
    fontFamily: 'Baskerville',
    fontSize: 36,
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '600',
  },
  taglineSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  tagline: {
    fontFamily: 'Baskerville',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  taglineHighlight: {
    color: '#69DC9E',
    fontSize: 36,
    fontWeight: 'bold',
  },
  featuresSection: {
    marginTop: 40,
  },
  featuresBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  ctaSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  ctaBlur: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
  },
  ctaGradient: {
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 8,
  },
  skipBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  decorLine: {
    height: 1,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  decorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginHorizontal: 12,
  },
});

export default Login;