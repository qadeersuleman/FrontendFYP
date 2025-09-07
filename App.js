import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import AuthLoadingScreen from './app/Screen/Authentication/AuthLoadingScreen';

// Screen Imports
import SplashScreen from './app/Screen/SplashScreen';
import WelcomeScreen from './app/Screen/WelcomeScreens/WelcomeScreen';
import Login from './app/Screen/Authentication/Login';
import Signup from './app/Screen/Authentication/Signup';
import ForgetPassword from './app/Screen/Authentication/ForgetPassword';
import AuthSuccessScreen from './app/Screen/Authentication/AuthSuccessScreen';
import EditProfile from './app/Screen/Profile/EditProfile';

// Assessment Screens
import HealthGoal from './app/Screen/Assesment/HealthGoal';
import AgeSelection from './app/Screen/Assesment/AgeSelection';
import WeightSelection from './app/Screen/Assesment/WeightSelection';
import MoodAssessment from './app/Screen/Assesment/Mood';
import SleepQuality from './app/Screen/Assesment/SleepQuality';
import SoundAnalysis from './app/Screen/Assesment/SoundAnalysis';
import ExpressionAnalysis from './app/Screen/Assesment/ExpressionAnalysis';

// Main App Screens
import Home from './app/Screen/Home/Home';
import SettingsScreen from './app/Screen/Faizan/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="AuthLoading">

    <Stack.Screen 
          name="AuthLoading" 
          component={AuthLoadingScreen} 
          options={{ headerShown: false }} 
        />

        {/* Initial Screens */}
        <Stack.Screen 
          name="SplashScreen" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Authentication Screens */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ForgetPassword" 
          component={ForgetPassword} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AuthSuccess" 
          component={AuthSuccessScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Profile Screen */}
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfile} 
          options={{ headerShown: false }} 
        />
        
        {/* Assessment Screens */}
        <Stack.Screen 
          name="HealthGoal" 
          component={HealthGoal} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AgeSelection" 
          component={AgeSelection} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="WeightSelection" 
          component={WeightSelection} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MoodAssessment" 
          component={MoodAssessment} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SleepQuality" 
          component={SleepQuality} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="SoundAnalysis" 
          component={SoundAnalysis} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ExpressionAnalysis" 
          component={ExpressionAnalysis} 
          options={{ headerShown: false }} 
        />
        
        {/* Main App Screens */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});