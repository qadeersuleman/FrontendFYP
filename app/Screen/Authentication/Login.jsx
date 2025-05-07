



import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { Colors } from "../../assets/colors";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Fonts } from "../../assets/config/fonts"; // Update the path
import axios from "axios";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (!/^[A-Z]/.test(password)) {
      newErrors.password = "Password must start with a capital letter";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }

    try {
      const response = await axios.post(
        'http://192.168.70.26:8000/api/login/',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      // Handle successful login (navigation, state update, etc.)
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred during login"
      );
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <Text style={[Fonts.heading2, styles.title]}>Sign In To MindMate</Text>
      <View style={styles.container}>
        {/* Email Input */}
        <Text style={[Fonts.bodySmall, styles.label]}>Email Address</Text>
        <View
          style={[styles.inputContainer, isEmailFocused && styles.focusedInput]}
        >
          <MaterialIcons
            name="email"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            style={[Fonts.bodyLarge, styles.input]}
            placeholder="Enter Your Email..."
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              // Clear error when user types
              if (errors.email) {
                setErrors({ ...errors, email: "" });
              }
            }}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        {/* Password Input */}
        <Text style={[Fonts.bodySmall, styles.label]}>Password</Text>
        <View
          style={[
            styles.inputContainer,
            isPasswordFocused && styles.focusedInput,
          ]}
        >
          <FontAwesome name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={[Fonts.bodyLarge, styles.input]}
            placeholder="Enter your password..."
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              // Clear error when user types
              if (errors.password) {
                setErrors({ ...errors, password: "" });
              }
            }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#666"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={[Fonts.buttonPrimary, styles.signInButtonText]}>Login →</Text>
        </TouchableOpacity>

        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.iconContainer}>
            <FontAwesome name="facebook" size={24} style={styles.Icons} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <FontAwesome name="google" size={24} style={styles.Icons} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <FontAwesome name="instagram" size={24} style={styles.Icons} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[Fonts.bodySmall, styles.footerText]}>
            Don't have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={[Fonts.buttonSecondary, { color: Colors.secondary }]}>
              Sign Up.
            </Text>
            </TouchableOpacity>
          </Text>
          <Pressable onPress={() => navigation.navigate("ForgetPassword")}>
          <Text style={[Fonts.buttonSecondary, { color: Colors.secondary, textAlign: 'center' }]}>
            Forgot Password
          </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (keep all your existing styles)
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 15,
  },
  hintContainer: {
    marginBottom: 20,
    marginLeft: 10,
  },
  hintText: {
    color: '#666',
    fontSize: 12,
  },
  
  logoContainer: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    color: Colors.primary,
    marginBlock: 50,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    marginBottom: 8,
    marginLeft: 10,
    fontSize : 16,
    fontWeight : "bold"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ddd",
    borderRadius: 30,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  focusedInput: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  socialIcons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  Icons: {
    fontSize: 24,
    color: Colors.primary,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  signInButtonText: {
    color: "#fff",
    fontSize : 20
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    marginBottom: 10,
  },
});

export default Login;