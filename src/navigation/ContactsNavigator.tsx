import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import Screens from '../screens';
import DefaultStackConfig from '../utils/defaultNavConfig';
import {ContactStackParamList} from './types';

const Stack = createStackNavigator<ContactStackParamList>();

function ContactsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({...DefaultStackConfig(route)})}>
      <Stack.Screen name="Contacts" component={Screens.Contacts} />
    </Stack.Navigator>
  );
}

export default ContactsNavigator;
