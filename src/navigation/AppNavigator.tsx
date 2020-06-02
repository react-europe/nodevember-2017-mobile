import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform} from 'react-native';

import Screen from '../screens';
import QRCheckinScannerModalNavigation from '../screens/QRScreens/CheckIn';
import QRContactScannerModalNavigation from '../screens/QRScreens/Contact';
import QRScannerModalNavigation from '../screens/QRScreens/Identify';
import {AppStackParamList} from '../typings/navigation';
import DefaultStackConfig from '../utils/defaultNavConfig';
import {checkLargeScreen} from '../utils/useScreenWidth';
import DrawerNavigator from './DrawerNavigator';
import PrimaryTabNavigator from './PrimaryTabNavigator';
import StaffCheckinListsNavigator from './StaffCheckinListsNavigator';

const Stack = createStackNavigator<AppStackParamList>();

function AppNavigator() {
  const isLargeScreen = checkLargeScreen();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode="none"
      mode="modal"
      screenOptions={({route}) => ({...DefaultStackConfig(route)})}>
      <Stack.Screen
        name="Home"
        component={
          Platform.OS === 'web' && isLargeScreen
            ? DrawerNavigator
            : PrimaryTabNavigator
        }
      />
      <Stack.Screen name="AttendeeDetail" component={Screen.AttendeeDetail} />
      <Stack.Screen
        name="TicketInstructions"
        component={Screen.TicketInstructions}
      />
      <Stack.Screen
        name="CheckedInAttendeeInfo"
        component={Screen.CheckedInAttendeeInfo}
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
      <Stack.Screen
        name="Details"
        component={Screen.Details}
        options={{gestureEnabled: false}}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
