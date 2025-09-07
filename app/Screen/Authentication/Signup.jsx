import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const SignupScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const socialAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(socialAnim, {
        toValue: 1,
        duration: 1200,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    animateButton();
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    animateButton();
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/^[A-Z]/, 'Must start with a capital letter')
      .matches(/[!@#$%^&*]/, 'Must contain a special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

 // Handle Signup form submission
const handleSubmit = async (values) => {
  setIsSubmitting(true);
  try {
    // Button animation
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // API call
    const response = await axios.post(
      'http://192.168.100.11:8000/api/signup/',
      {
        email: values.email,
        password: values.password,
        full_name: values.full_name || '',
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('Signup successful:', response.data);
    
    // Save user session
    await saveSession(response.data.user);
    
    // Redirect to edit profile screen after signup
    navigation.navigate('EditProfile');
    
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    Alert.alert(
      'Signup Failed',
      error.response?.data?.error || 
      error.response?.data?.message || 
      'An error occurred during signup'
    );
  } finally {
    setIsSubmitting(false);
  }
};


  const socialTranslateY = socialAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const socialOpacity = socialAnim;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          {/* Header with Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
                borderBottomLeftRadius: isTablet ? 180 : 120,
                borderBottomRightRadius: isTablet ? 180 : 120,
              },
            ]}
          >
            <LinearGradient
              colors={['#4E7AC7', '#5EC8D8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <LottieView
                source={require('../../assets/json/wave.json')}
                autoPlay
                loop
                style={styles.waveAnimation}
              />
              <Animated.View style={{ transform: [{ scale: logoScale }] }}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          {/* Main Content */}
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateY: slideUpAnim }],
                paddingHorizontal: isTablet ? 40 : 20,
              },
            ]}
          >
            <Text style={[styles.title, { fontSize: isTablet ? 28 : 24 }]}>
              Create Your Account
            </Text>

            <Formik
              initialValues={{ email: '', password: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  {/* Email */}
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="email"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Your Email..."
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}

                  {/* Password */}
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome
                      name="lock"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password..."
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                    />
                    <TouchableOpacity onPress={toggleShowPassword}>
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#666"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}

                  {/* Confirm Password */}
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome
                      name="lock"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password..."
                      placeholderTextColor="#999"
                      secureTextEntry={!showConfirmPassword}
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                    />
                    <TouchableOpacity onPress={toggleShowConfirmPassword}>
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#666"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}

                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                      style={[
                        styles.signInButton,
                        {
                          backgroundColor: isSubmitting ? '#3A5F9A' : '#4E7AC7',
                        },
                      ]}
                      onPress={handleSubmit}
                      activeOpacity={0.9}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <LottieView
                          source={require('../../assets/json/Trail loading.json')}
                          autoPlay
                          loop
                          style={styles.loadingAnimation}
                        />
                      ) : (
                        <Text style={styles.signInButtonText}>
                          Sign Up <Feather name="arrow-right" size={18} />
                        </Text>
                      )}
                    </TouchableOpacity>
                  </Animated.View>

                  <Text style={styles.OR}>OR CONTINUE WITH</Text>

                  {/* Social Icons */}
                  <Animated.View
                    style={[
                      styles.socialIcons,
                      {
                        opacity: socialOpacity,
                        transform: [{ translateY: socialTranslateY }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.iconContainer, { borderColor: '#5EC8D8' }]}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name="facebook"
                        size={24}
                        color="#5EC8D8"
                        style={styles.Icons}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.iconContainer, { borderColor: '#FF7B7B' }]}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name="google"
                        size={24}
                        color="#FF7B7B"
                        style={styles.Icons}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.iconContainer,
                        { borderColor: '#957FEF' },
                      ]}
                      activeOpacity={0.7}
                    >
                      <FontAwesome
                        name="apple"
                        size={24}
                        color="#957FEF"
                        style={styles.Icons}
                      />
                    </TouchableOpacity>
                  </Animated.View>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>
                      Already have an account?{' '}
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: '#4E7AC7' }}>Login</Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                </>
              )}
            </Formik>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: '100%',
    height: isTablet ? height * 0.3 : height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: isTablet ? 20 : 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveAnimation: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    opacity: 0.6,
  },
  logoImage: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    tintColor: '#fff',
  },
  title: {
    marginTop: isTablet ? 10 : 5,
    marginBottom: isTablet ? 30 : 20,
    textAlign: 'center',
    color: '#4E7AC7',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  label: {
    marginBottom: 8,
    marginLeft: 15,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    marginBottom: 5,
    paddingHorizontal: 20,
    height: isTablet ? 60 : 50,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: '100%',
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  signInButton: {
    height: isTablet ? 60 : 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#4E7AC7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingAnimation: {
    width: 50,
    height: 50,
  },
  signInButtonText: {
    fontSize: isTablet ? 20 : 18,
    letterSpacing: 0.5,
    color: '#fff',
    fontWeight: '600',
  },
  socialIcons: {
    marginTop: isTablet ? 30 : 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: isTablet ? 15 : 10,
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  Icons: {
    fontSize: isTablet ? 26 : 22,
  },
  footer: {
    marginTop: isTablet ? 30 : 20,
    alignItems: 'center',
  },
  footerText: {
    marginBottom: 10,
    color: '#666',
  },
  error: {
    color: 'red',
    fontSize: isTablet ? 14 : 12,
    marginLeft: 20,
    marginBottom: isTablet ? 15 : 10,
  },
  OR: {
    textAlign: 'center',
    fontSize: isTablet ? 16 : 14,
    marginTop: isTablet ? 30 : 20,
    marginBottom: isTablet ? 20 : 15,
    letterSpacing: 1,
    color: '#666',
  },
});

export default SignupScreen;