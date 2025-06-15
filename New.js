import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const New = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const enabled = status === 'granted';
      setHasPermission(enabled);

      if (enabled) {
        const token = await registerForPushNotifications();
        setExpoPushToken(token);
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
      setHasPermission(false);
    }
  };

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const requestPermission = async () => {
    try {
      const token = await registerForPushNotifications();
      if (token) {
        setHasPermission(true);
        setExpoPushToken(token);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notification Status</Text>
      
      {hasPermission === null ? (
        <Text>Checking permission...</Text>
      ) : hasPermission ? (
        <View>
          <Text style={styles.statusText}>Permission granted ✅</Text>
          {expoPushToken && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Expo Push Token:</Text>
              <Text style={styles.tokenText} selectable>{expoPushToken}</Text>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.statusText}>Permission not granted ❌</Text>
          <Button 
            title="Request Notification Permission" 
            onPress={requestPermission} 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  tokenContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  tokenLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tokenText: {
    fontSize: 12,
  },
});

export default New;