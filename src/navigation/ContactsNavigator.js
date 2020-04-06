import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import DefaultStackConfig from '../utils/defaultNavConfig';
import Screens from '../screens';

const Stack = createStackNavigator();

function ContactsNavigator() {
  return (
    <Stack.Navigator screenOptions={route => ({...DefaultStackConfig(route)})}>
      <Stack.Screen name="Contacts" component={Screens.Contacts} />
    </Stack.Navigator>
  );
}

export default ContactsNavigator;
