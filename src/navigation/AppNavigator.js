import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PrimaryTabNavigator from './PrimaryTabNavigator';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={PrimaryTabNavigator} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
