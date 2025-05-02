import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




// Screen Apps
import MentalHealth from './app/Screen/MentalHealth'
import WelcomeScreen from './app/Screen/WelcomeScreens/WelcomeScreen';
import SplashScreen from './app/Screen/SplashScreen';
import Login from './app/Screen/Authentication/Login';
import Signup from './app/Screen/Authentication/Signup';

// Third Party App


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <DetectEmotion />
    
    // This is the main screen
    // <MentalHealth /> 
    // <WelcomeScreen />
    // <SplashScreen />




    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown : false}} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown : false }} />
        <Stack.Screen name="CamerView" component={MentalHealth} options={{ headerShown : false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown : false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown : false }} />
      </Stack.Navigator>
    </NavigationContainer>

    // <Signup />
    // <Login />
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    margin : 20,
    borderRadius : 20
  },
});
