import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DefaultStackConfig from '../utils/defaultNavConfig';
import Screens from '../screens';

const Stack = createStackNavigator();

function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={route => ({...DefaultStackConfig(route)})}>
      <Stack.Screen name="Profile" component={Screens.Profile} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;
