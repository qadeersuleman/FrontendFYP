import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSession = async (userData) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  } catch (e) {
    console.error("Error saving session", e);
  }
};

export const getSession = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Error reading session", e);
    return null;
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (e) {
    console.error("Error clearing session", e);
  }
};