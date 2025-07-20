import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ModernSplashScreen = ({ navigation }) => {
  // Animation values
  const gradientScale = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoPosition = useRef(new Animated.Value(height * 0.4)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const gradientOpacity = useRef(new Animated.Value(0)).current;
  
  const [progressText, setProgressText] = useState('Starting');
  const [currentDot, setCurrentDot] = useState(0);

  // Dot animation sequence
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setCurrentDot(prev => (prev + 1) % 4);
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  // Main animation sequence
  useEffect(() => {
    // 1. Gradient background scale in
    Animated.parallel([
      Animated.timing(gradientScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(gradientOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // 2. Logo animation sequence
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(logoPosition, {
          toValue: height * 0.3,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Progress bar and dots animation
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(progressWidth, {
        toValue: width * 0.7,
        duration: 2500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();

    // 4. Progress text updates
    const progressUpdates = [
      { time: 500, text: 'Loading assets' },
      { time: 1200, text: 'Preparing UI' },
      { time: 1900, text: 'Finalizing' },
      { time: 2500, text: 'Ready' },
    ];

    const startTime = Date.now();
    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const update = progressUpdates.find(u => elapsed <= u.time);
      if (update) setProgressText(update.text);
    }, 100);

    // 5. Final content fade in
    setTimeout(() => {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => navigation.navigate('WelcomeScreen'), 800);
      });
      clearInterval(updateInterval);
    }, 3000);
  }, []);

  const dots = [0, 1, 2, 3].map(i => (
    <Animated.Text
      key={i}
      style={[
        styles.dot,
        {
          opacity: currentDot === i ? dotsOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1]
          }) : dotsOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.5]
          }),
          transform: [{
            scale: currentDot === i ? 
              dotsOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2]
              }) : 1
          }]
        }
      ]}
    >
      •
    </Animated.Text>
  ));

  return (
    <View style={styles.container}>
      {/* Animated gradient background */}
      <Animated.View style={[
        styles.gradientContainer,
        {
          opacity: gradientOpacity,
          transform: [{
            scale: gradientScale.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1.2]
            })
          }]
        }
      ]}>
        <LinearGradient
          colors={['#0F2027', '#203A43', '#2C5364']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      {/* Logo with animations */}
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: logoOpacity,
          transform: [
            { scale: logoScale },
            { translateY: logoPosition }
          ]
        }
      ]}>
        <Image
          source={require('../assets/images/logo.png')} // Replace with your logo
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Progress section */}
      <View style={styles.progressContainer}>
        <Animated.Text style={[styles.progressText, { opacity: dotsOpacity }]}>
          {progressText}
          {dots}
        </Animated.Text>
        
        <View style={styles.progressBarBackground}>
          <Animated.View style={[
            styles.progressBar,
            { width: progressWidth }
          ]}>
            <LinearGradient
              colors={['#4A8AFF', '#9B4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressBarFill}
            />
          </Animated.View>
        </View>
      </View>

      {/* Final content that fades in */}
      <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>YourApp</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E23',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientContainer: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 1.5,
  },
  gradient: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    tintColor: '#FFF', // Optional: if you want to color your logo
  },
  progressContainer: {
    position: 'absolute',
    bottom: height * 0.2,
    width: '80%',
    alignItems: 'center',
  },
  progressText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  dot: {
    fontSize: 24,
    color: '#FFF',
    marginHorizontal: 2,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 5,
  },
  appName: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default ModernSplashScreen;