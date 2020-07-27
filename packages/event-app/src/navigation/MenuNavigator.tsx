import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import Screens from '../screens';
import {MenuStackParamList} from '../typings/navigation';
import DefaultStackConfig from '../utils/defaultNavConfig';
import EditEventNavigator from './EditEventNavigator';

const Stack = createStackNavigator<MenuStackParamList>();

function MenuNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({...DefaultStackConfig(route)})}>
      <Stack.Screen name="Menu" component={Screens.Menu} />
      <Stack.Screen name="Speakers" component={Screens.Speakers} />
      <Stack.Screen name="EditSpeaker" component={Screens.EditSpeaker} />
      <Stack.Screen name="Crew" component={Screens.Crew} />
      <Stack.Screen name="Sponsors" component={Screens.Sponsors} />
      <Stack.Screen name="Attendees" component={Screens.Attendees} />
      <Stack.Screen name="AttendeeDetail" component={Screens.AttendeeDetail} />
      <Stack.Screen name="Editions" component={Screens.Editions} />
      <Stack.Screen name="EditEvent" component={EditEventNavigator} />
      <Stack.Screen name="Tickets" component={Screens.Tickets} />
      <Stack.Screen name="EditTicket" component={Screens.EditTicket} />
      <Stack.Screen name="CheckinLists" component={Screens.CheckinLists} />
      <Stack.Screen name="SignIn" component={Screens.SignIn} />
    </Stack.Navigator>
  );
}

export default MenuNavigator;
