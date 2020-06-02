import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {AsyncStorage} from 'react-native';
import {useTheme} from 'react-native-paper';

import DrawerOpenButton from '../components/DrawerOpenButton';
import Screens from '../screens';
import DefaultStackConfig from '../utils/defaultNavConfig';
import {useCurrentScreenWidth} from '../utils/useScreenWidth';
import ContactsNavigator from './ContactsNavigator';
import ProfileNavigator from './ProfileNavigator';
import ScheduleNavigator from './ScheduleNavigator';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
  }, []);

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
      <Drawer.Screen name="Speakers" component={SpeakersNavigator} />
      <Drawer.Screen name="Sponsors" component={SponsorsNavigator} />
      {haveTitcket && (
        <Drawer.Screen name="Attendees" component={AttendeesNavigator} />
      )}
    </Drawer.Navigator>
  );
}

function SpeakersNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({...DefaultStackConfig(route)})}>
      <Stack.Screen
        name="Speakers"
        component={Screens.Speakers}
        options={({navigation}) => DrawerOpenButton(navigation)}
      />
    </Stack.Navigator>
  );
}

function SponsorsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({...DefaultStackConfig(route)})}>
      <Stack.Screen
        name="Sponsors"
        component={Screens.Sponsors}
        options={({navigation}) => DrawerOpenButton(navigation)}
      />
    </Stack.Navigator>
  );
}

function AttendeesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({...DefaultStackConfig(route)})}>
      <Stack.Screen
        name="Attendees"
        component={Screens.Attendees}
        options={({navigation}) => DrawerOpenButton(navigation)}
      />
    </Stack.Navigator>
  );
}
