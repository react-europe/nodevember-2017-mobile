import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';
import {AsyncStorage} from 'react-native';
import {useTheme} from 'react-native-paper';

import Screens from '../screens';
import Attendees from '../screens/Attendees';
import Speakers from '../screens/Speakers';
import Sponsors from '../screens/Sponsors';
import {useCurrentScreenWidth} from '../utils/useScreenWidth';
import ContactsNavigator from './ContactsNavigator';
import ProfileNavigator from './ProfileNavigator';
import ScheduleNavigator from './ScheduleNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const {colors} = useTheme();
  const [haveTitcket, setHaveTicket] = useState(false);
  const isLargeScreen = useCurrentScreenWidth();

  async function checkTickets() {
    const value = await AsyncStorage.getItem('@MySuperStore2019:tickets'); // todo: use recoil
    if (value) {
      setHaveTicket(true);
    }
  }

  useEffect(() => {
    checkTickets();
  });

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContentOptions={{activeTintColor: colors.primary}}
      drawerPosition="left"
      drawerType={isLargeScreen ? 'permanent' : 'back'}
      drawerStyle={isLargeScreen ? null : {width: '100%'}}
      openByDefault>
      <Drawer.Screen name="Home" component={Screens.Home} />
      <Drawer.Screen name="Profile" component={ProfileNavigator} />
      <Drawer.Screen name="Schedule" component={ScheduleNavigator} />
      {haveTitcket && (
        <Drawer.Screen name="Contacts" component={ContactsNavigator} />
      )}
      <Drawer.Screen name="Speakers" component={Speakers} />
      <Drawer.Screen name="Sponsors" component={Sponsors} />
      {haveTitcket && <Drawer.Screen name="Attendees" component={Attendees} />}
    </Drawer.Navigator>
  );
}
