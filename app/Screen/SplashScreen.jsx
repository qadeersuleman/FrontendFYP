import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onComplete, navigation }) => {
  // Calculate the diagonal of the screen to ensure full coverage
  const screenDiagonal = Math.sqrt(width * width + height * height);
  
  // Animation refs
  const spreadAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const logoMoveAnim = useRef(new Animated.Value(0)).current;
  const percentageAnim = useRef(new Animated.Value(1)).current;
  const spinnerRotateAnim = useRef(new Animated.Value(0)).current;
  const counterOpacityAnim = useRef(new Animated.Value(0)).current;

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Step 1: Spread animation (5 seconds)
    Animated.timing(spreadAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      // Step 2: Logo appears
      Animated.parallel([
        Animated.timing(logoScaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Step 3: Move logo up slightly after a delay
        setTimeout(() => {
          Animated.timing(logoMoveAnim, {
            toValue: -50,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }, 1000);

        // Step 4: Show spinner and counter
        Animated.parallel([
          Animated.timing(counterOpacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.timing(spinnerRotateAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ),
        ]).start();

        // Step 5: Animate percentage counter
        const duration = 1500;
        let start = null;

        const animateCounter = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const count = Math.floor(progress * 100);
          setPercentage(count);

          // Add bounce effect every 10%
          if (count % 10 === 0 && count !== 0) {
            Animated.sequence([
              Animated.timing(percentageAnim, {
                toValue: 1.2,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(percentageAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]).start();
          }

          if (progress < 1) {
            requestAnimationFrame(animateCounter);
          } else {
            setTimeout(onComplete, 300);
          }
        };

        requestAnimationFrame(animateCounter);
      });
    });
  }, []);

  useEffect(() => {
    if (percentage === 100) {
      // Add slight delay if needed
      const timeout = setTimeout(() => {
        navigation.navigate('WelcomeScreen');
      }, 300);
  
      return () => clearTimeout(timeout);
    }
  }, [percentage]);
  

  // Interpolations
  const rotateInterpolation = spinnerRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background spread effect - covers full screen */}
      <Animated.View
        style={[
          styles.spreadEffect,
          {
            width: screenDiagonal,
            height: screenDiagonal,
            borderRadius: screenDiagonal / 2,
            transform: [
              { 
                scale: spreadAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }
            ],
            backgroundColor: '#0F1C3F',
          },
        ]}
      />

      {/* Logo with animations */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacityAnim,
            transform: [
              { scale: logoScaleAnim },
              { translateY: logoMoveAnim },
            ],
          },
        ]}
      >
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Spinner and percentage counter */}
      <Animated.View
        style={[styles.counterContainer, { opacity: counterOpacityAnim }]}
      >
        <Animated.Image
          source={require('../assets/images/spiner.png')}
          style={[
            styles.spinner,
            { transform: [{ rotate: rotateInterpolation }] },
          ]}
        />
        <Animated.Text
          style={[
            styles.percentage,
            { transform: [{ scale: percentageAnim }] },
          ]}
        >
          {percentage}%
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  spreadEffect: {
    position: 'absolute',
    alignSelf: 'center',
  },
  logoContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  logo: {
    width: 250,
    height: 250,
  },
  counterContainer: {
    position: 'absolute',
    bottom: '20%',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 120,
    height: 120,
    position: 'absolute',
  },
  percentage: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300',
  },
});

export default SplashScreen;