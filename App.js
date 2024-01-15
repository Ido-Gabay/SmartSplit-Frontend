import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/Navigators/AuthNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}