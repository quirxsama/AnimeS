/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';

// Video uyarılarını görmezden gelelim (geliştirme aşamasında)
LogBox.ignoreLogs([
  'Calling getNode() on the ref of an Animated component',
  'ViewPropTypes will be removed from React Native',
]);

const App = () => {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
