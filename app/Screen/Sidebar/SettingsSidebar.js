// components/SettingsSidebar.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../assets/colors';

const { width } = Dimensions.get('window');

const SettingsSidebar = ({ isVisible, onClose, onLogout }) => {
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.sidebarContent}>
            <Text style={styles.sidebarTitle}>Settings</Text>
            
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
            >
              <Ionicons name="log-out-outline" size={24} color={Colors.ui.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: Colors.neutrals.surface,
    borderLeftWidth: 1,
    borderLeftColor: Colors.ui.border,
  },
  sidebarContent: {
    padding: 20,
    paddingTop: 60,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.ui.errorLight,
    borderRadius: 10,
    marginTop: 20,
  },
  
  logoutText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.ui.error,
  },
});

export default SettingsSidebar;