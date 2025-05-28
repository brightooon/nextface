import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import PhotoUploadScreen from './src/screens/PhotoUploadScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200EE',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'NextFace AI' }}
          />
          <Stack.Screen 
            name="PhotoUpload" 
            component={PhotoUploadScreen} 
            options={{ title: 'Upload Photo' }}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen} 
            options={{ title: 'Analysis Result' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}