import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import Screens from '../screens';
import DefaultStackConfig from '../utils/defaultNavConfig';
import {ProfileStackParamList, ProfileProps} from './types';

const Stack = createStackNavigator<ProfileStackParamList>();

function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({route}: ProfileProps) => ({
        ...DefaultStackConfig(route),
      })}>
      <Stack.Screen name="Profile" component={Screens.Profile} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;
