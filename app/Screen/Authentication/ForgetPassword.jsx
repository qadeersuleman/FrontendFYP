import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Colors } from "../../assets/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Fonts } from "../../assets/config/fonts";
import axios from "axios";

const ForgetPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "" };

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }

    try {
      const response = await axios.post(
        'http://192.168.70.26:8000/api/password-reset/',
        {
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      Alert.alert(
        "Reset Link Sent",
        "Please check your email for password reset instructions"
      );
      navigation.navigate("Login"); // Redirect to login after successful request
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        "Request Failed",
        error.response?.data?.message || "An error occurred while processing your request"
      );
    }
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
      <Text style={[Fonts.heading2, styles.title]}>Reset Your Password</Text>
      <View style={styles.container}>
        <Text style={[Fonts.bodySmall, styles.description]}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

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

        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={[Fonts.buttonPrimary, styles.resetButtonText]}>Send Reset Link</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[Fonts.bodySmall, styles.footerText]}>
            Remember your password?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[Fonts.buttonSecondary, { color: Colors.secondary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 15,
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
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    marginBottom: 8,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold"
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
  resetButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 20
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

export default ForgetPassword;