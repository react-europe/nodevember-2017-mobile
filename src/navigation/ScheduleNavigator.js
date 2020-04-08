import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DefaultStackConfig from '../utils/defaultNavConfig';
import DynamicScheduleNavigation from './DynamicScheduleNavigation';

const Stack = createStackNavigator();

export default function ScheduleNavigator() {
  return (
    <Stack.Navigator screenOptions={route => ({...DefaultStackConfig(route)})}>
      <Stack.Screen name="Schedule" component={DynamicScheduleNavigation} />
    </Stack.Navigator>
  );
}
