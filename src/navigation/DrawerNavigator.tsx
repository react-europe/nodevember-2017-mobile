import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';

import Screens from '../screens';
import Attendees from '../screens/Attendees';
import Speakers from '../screens/Speakers';
import Sponsors from '../screens/Sponsors';
import ContactsNavigator from './ContactsNavigator';
import ProfileNavigator from './ProfileNavigator';
import ScheduleNavigator from './ScheduleNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerType="permanent"
      openByDefault>
      <Drawer.Screen name="Home" component={Screens.Home} />
      <Drawer.Screen name="Profile" component={ProfileNavigator} />
      <Drawer.Screen name="Schedule" component={ScheduleNavigator} />
      <Drawer.Screen name="Contacts" component={ContactsNavigator} />
      <Drawer.Screen name="Speakers" component={Speakers} />
      <Drawer.Screen name="Sponsors" component={Sponsors} />
      <Drawer.Screen name="Attendees" component={Attendees} />
    </Drawer.Navigator>
  );
}
