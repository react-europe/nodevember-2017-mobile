import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PrimaryTabNavigator from './PrimaryTabNavigator';
import StaffCheckinListsNavigator from './StaffCheckinListsNavigator';
import DefaultStackConfig from '../utils/defaultNavConfig';
import QRScannerModalNavigation from '../screens/QRScreens/Identify';
import QRContactScannerModalNavigation from '../screens/QRScreens/Contact';
import QRCheckinScannerModalNavigation from '../screens/QRScreens/CheckIn';
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
      <Stack.Screen
        name="TicketInstructions"
        component={Screen.TicketInstructions}
      />
      <Stack.Screen name="QRScanner" component={QRScannerModalNavigation} />
      <Stack.Screen
        name="QRCheckinScanner"
        component={QRCheckinScannerModalNavigation}
      />
      <Stack.Screen
        name="QRContactScanner"
        component={QRContactScannerModalNavigation}
      />
      <Stack.Screen
        name="StaffCheckinLists"
        component={StaffCheckinListsNavigator}
      />
      <Stack.Screen name="Details" component={Screen.Details} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
