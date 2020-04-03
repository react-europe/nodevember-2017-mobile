import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PrimaryTabNavigator from './PrimaryTabNavigator';
import DefaultStackConfig from '../utils/defaultNavConfig';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      headerMode={'none'}
      mode={'modal'}
      {...DefaultStackConfig}>
      <Stack.Screen name="Home" component={PrimaryTabNavigator} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
