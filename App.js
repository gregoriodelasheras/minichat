import React from 'react';

// Change default font to Monserrat.
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
} from '@expo-google-fonts/montserrat';

// Internal components.
import Start from './components/Start';
import Chat from './components/Chat';

// Native-Driven gesture management for improved touch-based experiences.
import 'react-native-gesture-handler';

// Routing and navigation for Expo and React Native apps.
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function App() {
  // Select the fonts to use.
  let [fontsLoaded] = useFonts({
    Regular: Montserrat_400Regular,
    RegularI: Montserrat_400Regular_Italic,
    SemiBold: Montserrat_600SemiBold,
    SemiBoldI: Montserrat_600SemiBold_Italic,
    Bold: Montserrat_700Bold,
    BoldI: Montserrat_700Bold_Italic,
  });

  // Catch font loading errors.
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='miniChat'>
        <Stack.Screen name='miniChat' component={Start} />
        <Stack.Screen
          name='Chat'
          component={Chat}
          // Pass route prop as argument to the screen to set component title.
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
