import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import PhotoUploadScreen from '../screens/PhotoUploadScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
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
          headerBackTitleVisible: false,
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
  );
};

export default AppNavigator;