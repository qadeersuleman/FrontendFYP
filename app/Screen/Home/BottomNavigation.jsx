import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../assets/colors";
import { clearSession } from "../../utils/session"; // Adjust the path as needed

const BottomNavigation = ({ navigation, activeTab }) => {
  const handleLogout = async () => {
    try {
      // Clear the session data
      await clearSession();
      
      // Navigate to the login screen or initial screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], // Replace "Login" with your actual login screen name
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={[styles.iconContainer, activeTab === "Home" && styles.activeIconContainer]}>
            <Ionicons 
              name="home" 
              size={24} 
              color={activeTab === "Home" ? Colors.brand.primary : Colors.text.tertiary} 
            />
          </View>
          <Text style={activeTab === "Home" ? styles.activeNavText : styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate("Chat")}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name="chatbubble-outline" 
              size={24} 
              color={activeTab === "Chat" ? Colors.brand.primary : Colors.text.tertiary} 
            />
          </View>
          <Text style={activeTab === "Chat" ? styles.activeNavText : styles.navText}>Chat</Text>
        </TouchableOpacity>
        
        {/* Center Button with different styling */}
        <TouchableOpacity 
          style={styles.centralNavItem}
          onPress={() => navigation.navigate("Create")} // Replace with your central action
        >
          <View style={styles.centralIconContainer}>
            <Text style={{fontSize: 30, color: "white", fontWeight: 'bold'}}> + </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate("Articles")}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name="book-outline" 
              size={24} 
              color={activeTab === "Articles" ? Colors.brand.primary : Colors.text.tertiary} 
            />
          </View>
          <Text style={activeTab === "Articles" ? styles.activeNavText : styles.navText}>Articles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={handleLogout} // This will trigger the logout
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name="person-outline" 
              size={24} 
              color={Colors.text.tertiary} 
            />
          </View>
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BottomNavigation;