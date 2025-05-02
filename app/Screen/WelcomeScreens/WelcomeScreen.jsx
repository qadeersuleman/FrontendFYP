import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import Colors from '../../assets/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import {
  Poppins_600SemiBold,
  Poppins_800ExtraBold,
  Poppins_500Medium
} from '@expo-google-fonts/poppins';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { Lora_400Regular_Italic } from '@expo-google-fonts/lora';
const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  // Load fonts
  let [fontsLoaded] = useFonts({
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-ExtraBold': Poppins_800ExtraBold,
    'Poppins-Medium': Poppins_500Medium,
    'Inter-Regular': Inter_400Regular,
    'Lora-Italic': Lora_400Regular_Italic,
  });

  // Animation for subtle floating effect
  const floatAnim = new Animated.Value(0);
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <LinearGradient
      colors={['#f9f9f9', '#e6f2ff']}
      style={styles.container}
    >
      {/* Modern Logo with Floating Animation */}
      <Animated.View style={[styles.logoContainer, { transform: [{ translateY }] }]}>
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Centered Content */}
      <View style={styles.content}>
        <Text style={[styles.heading, { fontFamily: 'Poppins-SemiBold' }]}>WELCOME TO</Text>
        <Text style={[styles.title, { fontFamily: 'Poppins-ExtraBold' }]}>MindMate</Text>
        <Text style={[styles.subtitle, { fontFamily: 'Inter-Regular' }]}>
          Your AI-powered mental wellness companion.
          {"\n"}Personalized, private, and always available.
        </Text>
      </View>

      {/* Animated Gradient Button */}
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.8}
        onPress={() => {navigation.navigate('CamerView')}}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.buttonText, { fontFamily: 'Poppins-SemiBold' }]}>Get Started</Text>
          <View style={styles.arrowIcon}>
              <Text style={[styles.buttonText, {fontFamily : 'Poppins-SemiBold'}]}>→</Text>
            </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Footer - Sign In Link */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontFamily: 'Inter-Regular' }]}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.footerLink, { fontFamily: 'Poppins-Medium' }]}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: height * 0.01,
  },
  logo: {
    width: width * 1,
    height: width * 0.5 * 1,
    tintColor: Colors.primary,
  },
  content: {
    alignItems: 'center',
    marginBottom: height * 0.1,
  },
  heading: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    color: Colors.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: width * 0.1,
  },
  button: {
    width: width * 0.8,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection : "row"
  },
  arrowIcon: {
    marginLeft: 20,
    marginTop : -1.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: height * 0.05,
    flexDirection: 'row',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
  },
});

export default WelcomeScreen;