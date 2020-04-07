import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DefaultStackConfig from '../utils/defaultNavConfig';
import Screens from '../screens';

const Stack = createStackNavigator();

function StaffCheckinListsNavigator() {
  return (
    <Stack.Navigator screenOptions={route => ({...DefaultStackConfig(route)})}>
      <Stack.Screen
        name="StaffCheckinListsList"
        component={Screens.StaffCheckinLists}
      />
    </Stack.Navigator>
  );
}

export default StaffCheckinListsNavigator;
