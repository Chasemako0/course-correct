import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // ✅ Add this
import Toast from 'react-native-toast-message';

import SplashScreen from './screens/SplashScreen';
import LandingScreen from './screens/LandingScreen';
import MainTabs from './pages/MainTabs';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
}

