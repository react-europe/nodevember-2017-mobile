import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PrimaryTabNavigator from './PrimaryTabNavigator';
import DefaultStackConfig from '../utils/defaultNavConfig';
import QRScannerModalNavigation from '../screens/QRScreens/Identify';
import Screen from '../screens';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode={'none'}
      mode={'modal'}
      screenOptions={route => ({...DefaultStackConfig(route)})}>
      <Stack.Screen name="Home" component={PrimaryTabNavigator} />
      <Stack.Screen name="AttendeeDetail" component={Screen.AttendeeDetail} />
      <Stack.Screen name="QRScanner" component={QRScannerModalNavigation} />
      <Stack.Screen name="Details" component={Screen.Details} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
