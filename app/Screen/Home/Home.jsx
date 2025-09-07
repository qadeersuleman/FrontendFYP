import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../assets/colors";

import HomeProfile from "../../Screen/Home/HeaderProfile";
import HomeCards from "../../Screen/Home/HomeCards";
import MindfulTracker from "./MindfulTracker";
import AITherapySection from "./AITherapySection";
import ArticlesSection from "./ArticlesSection";

const { width } = Dimensions.get("window");

const Home = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HomeProfile />
        <HomeCards />
        <MindfulTracker />
        <AITherapySection />
        <ArticlesSection />
      </ScrollView>

      {/* Bottom Navigation - Updated to match the image */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <View style={[styles.iconContainer, styles.activeIconContainer]}>
              <Ionicons name="home" size={24} color={Colors.brand.primary} />
            </View>
            <Text style={styles.activeNavText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubble-outline" size={24} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.navText}>Chat</Text>
          </TouchableOpacity>
          
          {/* Center Button with different styling */}
          <TouchableOpacity style={styles.centralNavItem}>
            <View style={styles.centralIconContainer}>
              <Text style={{fontSize : 30, color: "white", fontWeight: 'bold'}}> + </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="book-outline" size={24} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.navText}>Articles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={24} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
  },
  scrollView: {
    flex: 1,
    marginBottom: 80, // Added margin to prevent content from being hidden behind the nav
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: Colors.neutrals.background,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.neutrals.surface,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: Colors.ui.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    flex: 1,
  },
  centralNavItem: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25, // Pulls the button upward
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  activeIconContainer: {
    backgroundColor: Colors.brand.primary + "20", // 20% opacity of primary color
  },
  centralIconContainer: {
    backgroundColor: Colors.brand.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.brand.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  activeNavText: {
    color: Colors.brand.primary,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  navText: {
    color: Colors.text.tertiary,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Home;