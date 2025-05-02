import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Colors } from "../../assets/colors";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Fonts } from "../../assets/config/fonts";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";


const Signup = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/^[A-Z]/, "Must start with a capital letter")
      .matches(/[!@#$%^&*]/, "Must contain a special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      alert("Signing up...");
      const response = await axios.post(
        "http://192.168.70.26:8000/api/signup/",
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Signup error:", error);
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
      <Text style={[Fonts.heading2, styles.title]}>Sign Up For Free</Text>

      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
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
          <View style={styles.container}>
            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "email" && styles.focusedInput,
              ]}
            >
              <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={[Fonts.bodyLarge, styles.input]}
                placeholder="Enter Your Email..."
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={() => {
                  handleBlur("email");
                }}
                onFocus={() => handleFocus("email")}
              />
            </View>
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "password" && styles.focusedInput,
              ]}
            >
              <FontAwesome name="lock" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={[Fonts.bodyLarge, styles.input]}
                placeholder="Enter your password..."
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={() => {
                  handleBlur("password");
                }}
                onFocus={() => handleFocus("password")}
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
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "confirmPassword" && styles.focusedInput,
              ]}
            >
              <FontAwesome name="lock" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={[Fonts.bodyLarge, styles.input]}
                placeholder="Confirm your password..."
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={() => {
                  handleBlur("confirmPassword");
                }}
                onFocus={() => handleFocus("confirmPassword")}
              />
              <TouchableOpacity onPress={toggleShowConfirmPassword}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity style={styles.signInButton} onPress={handleSubmit}>
              <Text style={[Fonts.buttonPrimary, styles.signInButtonText]}>
                Sign Up →
              </Text>
            </TouchableOpacity>
            <Text style={styles.OR}>OR</Text>
            {/* Social Icons and Footer */}
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
                Already have an account?{" "}
                <TouchableOpacity onPress={() => {navigation.navigate('Login')}}>
                <Text style={[Fonts.buttonSecondary, { color: Colors.secondary }]}>
                  Login.
                </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "rgb(240, 240, 240)",
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
    marginTop: 25,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 15,
  },
  label: {
    marginBottom: 8,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ddd",
    borderRadius: 30,
    marginBottom: 10,
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
  signInButton: {
    backgroundColor: Colors.primary,
    padding: 13,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 20,
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
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 15,
    marginBottom: 5,
  },
  OR : {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#666",
  }
});

export default Signup;