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
import ForgetPassword from './app/Screen/Authentication/ForgetPassword';
import HealthGoal from './app/Screen/Assesment/HealthGoal';

// Third Party App
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LottieCentered from './LottieCentered';
import AgeSelection from './app/Screen/Assesment/AgeSelection';
import WeightSelection from './app/Screen/Assesment/WeightSelection';
import New from './New';
import MoodAssessment from './app/Screen/Assesment/Mood';
import SleepQuality from './app/Screen/Assesment/SleepQuality';
import SoundAnalysis from './app/Screen/Assesment/SoundAnalysis';
import ExpressionAnalysis from './app/Screen/Assesment/ExpressionAnalysis';

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
        {/* <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown : false}} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown : false }} />
        
        <Stack.Screen name="Login" component={Login} options={{ headerShown : false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown : false }} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown : false }} /> */}
        <Stack.Screen name="HealthGoal" component={HealthGoal} options={{ headerShown: false }} />
        <Stack.Screen name="AgeSelection" component={AgeSelection} options={{ headerShown:false }} />
        <Stack.Screen name="WeightSelection" component={WeightSelection} options={{ headerShown:false }} />
        <Stack.Screen name="MoodAssessment" component={MoodAssessment} options={{ headerShown : false }} />
        <Stack.Screen name="SleepQuality" component={SleepQuality} options={{ headerShown : false }} />
        <Stack.Screen name="ExpressionAnalysis" component={ExpressionAnalysis} options={{ headerShown : false }} />
        <Stack.Screen name="SoundAnalysis" component={SoundAnalysis} options={{ headerShown : false }} />
        
      </Stack.Navigator>
    </NavigationContainer>

    // <Signup />
    // <Login />
    // <ForgetPassword />
    // <HealthGoal />

  //   <GestureHandlerRootView style={{ flex: 1 }}>
  //   {/* Your existing app components */}
  //   {/* <HealthGoal /> */}
  //     {/* <AgeSelection /> */}
  //   {/* <LottieCentered /> */}
  //   {/* <WeightSelection /> */}
  //   {/* <MoodAssessment /> */}
  //   {/* <SleepQuality /> */}
  //   {/* <New /> */}
  //   {/* <SplashScreen /> */}
  //   {/* <SoundAnalysis /> */}
  //   {/* <ExpressionAnalysis /> */}
  // </GestureHandlerRootView>
 
   
    
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
