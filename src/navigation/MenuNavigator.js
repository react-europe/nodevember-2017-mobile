import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DefaultStackConfig from '../utils/defaultNavConfig';
import {withData} from '../context/DataContext';
import Screens from '../screens';

const Stack = createStackNavigator();

function MenuNavigator() {
  return (
    <Stack.Navigator screenOptions={route => ({...DefaultStackConfig(route)})}>
      <Stack.Screen name="Menu" component={Screens.Menu} />
      <Stack.Screen name="Speakers" component={withData(Screens.Speakers)} />
      <Stack.Screen name="Crew" component={withData(Screens.Crew)} />
      <Stack.Screen name="Sponsors" component={withData(Screens.Sponsors)} />
      <Stack.Screen name="Attendees" component={withData(Screens.Attendees)} />
      <Stack.Screen name="AttendeeDetail" component={Screens.AttendeeDetail} />
    </Stack.Navigator>
  );
}

export default MenuNavigator;
