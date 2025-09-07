import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
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
  Alert,
  Platform,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";

import {getSession, saveSession} from "../../utils/session"

const { width, height } = Dimensions.get("window");

const EditProfile = ({ navigation, route }) => {
  const { username } = route.params || {};

  const [profileImage, setProfileImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(0)).current; // Changed initial value to 0
  const buttonScale = useRef(new Animated.Value(1)).current;

 
  useEffect(() => {
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
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardStatus(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardStatus(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    gender: Yup.string().required("Gender is required"),
    birthDate: Yup.date()
      .max(new Date(), "Birth date cannot be in the future")
      .required("Birth date is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  // In your handleSubmit function, fix the FormData creation:
  // Edit profile form
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Button animation
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Get the current user session to access user ID and email
      const userSession = await getSession();

      if (!userSession || !userSession.id) {
        Alert.alert("Error", "User not logged in. Please login again.");
        navigation.navigate("Login");
        return;
      }

      // Prepare form data (including image if selected)
      const formData = new FormData();
      formData.append("user_id", userSession.id); // Send user ID
      formData.append("email", userSession.email); // Also send email as backup
      formData.append("full_name", values.fullName);
      formData.append("gender", values.gender);
      formData.append(
        "date_of_birth",
        values.birthDate.toISOString().split("T")[0]
      );
      formData.append("phone_number", values.phoneNumber);

      if (profileImage) {
        // Extract filename from URI
        let filename = profileImage.split("/").pop();

        // Determine the file type
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("profile_image", {
          uri: profileImage,
          name: filename,
          type: type,
        });
      }

      // Send to your Django API
      const response = await axios.post(
        "http://192.168.100.11:8000/api/editprofile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the session with new user data
      const updatedUser = {
        ...userSession,
        full_name: values.fullName,
        gender: values.gender,
        date_of_birth: values.birthDate.toISOString().split("T")[0],
        phone_number: values.phoneNumber,
        hasCompletedProfile: true, // Mark profile as completed
        profile_image: response.data.user.profile_image, // Add profile image URL if available
      };
      await saveSession(updatedUser);

      Alert.alert("Success", "Profile updated successfully!");

      // Navigate to assessment screens after profile completion
      navigation.navigate("HealthGoal");
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={{ flex: 1 }}>
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          {/* Header */}
          <LinearGradient
            colors={["#4e7ac7", "#6a5acd"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Main Content */}
          <Animated.View
            style={[
              styles.container,
              { transform: [{ translateY: slideUpAnim }] },
            ]}
          >
            {/* Profile Picture */}
            <View style={styles.profilePictureContainer}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.profileImageWrapper}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <LinearGradient
                    colors={["#6a5acd", "#4e7ac7"]}
                    style={styles.profileImagePlaceholder}
                  >
                    <FontAwesome name="user" size={40} color="#fff" />
                  </LinearGradient>
                )}
                <View style={styles.editIcon}>
                  <Feather name="edit-2" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.profilePictureText}>Tap to change photo</Text>
            </View>

            <Formik
              initialValues={{
                fullName: "",
                gender: "",
                birthDate: new Date(1990, 0, 1),
                phoneNumber: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.formContainer}>
                  {/* Full Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputContainer}>
                      <FontAwesome
                        name="user"
                        size={20}
                        color="#666"
                        style={styles.icon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor="#999"
                        value={values.fullName}
                        onChangeText={handleChange("fullName")}
                        onBlur={handleBlur("fullName")}
                        onFocus={() => setKeyboardStatus(true)}
                      />
                    </View>
                    {touched.fullName && errors.fullName && (
                      <Text style={styles.error}>{errors.fullName}</Text>
                    )}
                  </View>

                  {/* Gender */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gender</Text>
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => setPickerVisible(true)}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons
                        name="person-outline"
                        size={20}
                        color="#666"
                        style={styles.icon}
                      />
                      <View style={{ flex: 1 }}>
                        <RNPickerSelect
                          onValueChange={(value) => {
                            setFieldValue("gender", value);
                          }}
                          items={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other", value: "other" },
                            {
                              label: "Prefer not to say",
                              value: "prefer_not_to_say",
                            },
                          ]}
                          value={values.gender}
                          placeholder={{
                            label: "Select your gender",
                            value: null,
                          }}
                          useNativeAndroidPickerStyle={false}
                          style={{
                            inputIOS: {
                              color: values.gender ? "#333" : "#999",
                              fontSize: 16,
                            },
                            inputAndroid: {
                              color: values.gender ? "#333" : "#999",
                              fontSize: 16,
                            },
                            placeholder: {
                              color: "#999",
                            },
                          }}
                          onOpen={() => setPickerVisible(true)}
                          onClose={() => setPickerVisible(false)}
                        />
                      </View>
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        size={24}
                        color="#666"
                        style={styles.dropdownIcon}
                      />
                    </TouchableOpacity>
                    {touched.gender && errors.gender && (
                      <Text style={styles.error}>{errors.gender}</Text>
                    )}
                  </View>

                  {/* Birth Date */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Birth Date</Text>
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <MaterialIcons
                        name="cake"
                        size={20}
                        color="#666"
                        style={styles.icon}
                      />
                      <View style={styles.dateTextContainer}>
                        <Text
                          style={[
                            styles.dateText,
                            !values.birthDate && { color: "#999" },
                          ]}
                        >
                          {values.birthDate
                            ? formatDate(values.birthDate)
                            : "Select your birth date"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {touched.birthDate && errors.birthDate && (
                      <Text style={styles.error}>{errors.birthDate}</Text>
                    )}
                    {showDatePicker && (
                      <DateTimePicker
                        value={values.birthDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        maximumDate={new Date()}
                        onChange={(event, date) => {
                          setShowDatePicker(Platform.OS === "ios");
                          if (date) {
                            setFieldValue("birthDate", date);
                          }
                        }}
                      />
                    )}
                  </View>

                  {/* Phone Number */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="phone"
                        size={20}
                        color="#666"
                        style={styles.icon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        value={values.phoneNumber}
                        onChangeText={handleChange("phoneNumber")}
                        onBlur={handleBlur("phoneNumber")}
                        onFocus={() => setKeyboardStatus(true)}
                      />
                    </View>
                    {touched.phoneNumber && errors.phoneNumber && (
                      <Text style={styles.error}>{errors.phoneNumber}</Text>
                    )}
                  </View>

                  {/* Save Button */}
                  <Animated.View
                    style={[
                      { transform: [{ scale: buttonScale }] },
                      keyboardStatus && styles.saveButtonKeyboardOpen,
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSubmit}
                      activeOpacity={0.9}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <View style={styles.loadingContainer}>
                          <LottieView
                            source={require("../../assets/json/Trail loading.json")}
                            autoPlay
                            loop
                            style={styles.loadingAnimation}
                          />
                        </View>
                      ) : (
                        <LinearGradient
                          colors={["#6a5acd", "#4e7ac7"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.saveButtonText}>
                            Save Changes <Feather name="save" size={18} />
                          </Text>
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}
            </Formik>
          </Animated.View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  skipText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingBottom: 10,
    justifyContent: "center",
  },
  formContainer: {
    paddingHorizontal: 25,
    marginTop: height < 700 ? 10 : 20,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginVertical: height < 700 ? 10 : 20,
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: height < 700 ? 100 : 120,
    height: height < 700 ? 100 : 120,
    borderRadius: height < 700 ? 50 : 60,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileImagePlaceholder: {
    width: height < 700 ? 100 : 120,
    height: height < 700 ? 100 : 120,
    borderRadius: height < 700 ? 50 : 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#6a5acd",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profilePictureText: {
    color: "#666",
    fontSize: 14,
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: height < 700 ? 12 : 15,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: "100%",
    color: "#333",
    fontSize: 16,
  },
  dateTextContainer: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    marginTop: height < 700 ? 15 : 25,
    overflow: "hidden",
    shadowColor: "#6a5acd",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonKeyboardOpen: {
    marginBottom: 20,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6a5acd", // Same as gradient color
  },
  loadingAnimation: {
    width: 50,
    height: 50,
  },
  saveButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  error: {
    color: "#ff4444",
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
  },
});

export default EditProfile;
