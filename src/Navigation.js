import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {View, Text, StatusBar} from 'react-native';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
} from 'react-navigation';

import Schedule from './data/schedule.json';
import moment from 'moment';
import {Colors, FontSizes, Layout} from './constants';

import Screens from './screens';
import QRScannerModalNavigation from './screens/QRScreens/Identify';
import QRCheckinScannerModalNavigation from './screens/QRScreens/CheckIn';
import QRContactScannerModalNavigation from './screens/QRScreens/Contact';
import Ionicons from '@expo/vector-icons/Ionicons';

const FullSchedule = Schedule.events[0].groupedSchedule;
let navSchedule = {};
_.each(FullSchedule, (day, i) => {
  navSchedule[day.title] = {
    screen: Screens.ScheduleDay({
      day: day.title,
      date: moment(new Date(day.date)).format('ddd'),
    }),
  };
});

const ScheduleNavigation = createMaterialTopTabNavigator(navSchedule, {
  tabBarOptions: {
    style: {backgroundColor: '#333'},
    activeTintColor: '#fff',
  },
  navigationOptions: ({navigation}) => ({
    tabBarLabel: navigation.state.routeName.substring(0, 3).toUpperCase(),
  }),
});

const DefaultStackConfig = {
  cardStyle: {
    backgroundColor: '#fafafa',
  },
  navigationOptions: ({navigation}) => ({
    title: navigation.state.routeName,
    headerStyle: {
      borderBottomWidth: 0,
      shadowRadius: 0,
      backgroundColor: Colors.blue,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontFamily: 'open-sans-bold',
    },
  }),
};

const MenuNavigation = createStackNavigator(
  {
    Menu: {screen: Screens.Menu},
    Speakers: {screen: Screens.Speakers},
    Crew: {screen: Screens.Crew},
    Sponsors: {screen: Screens.Sponsors},
    Attendees: {screen: Screens.Attendees},
    AttendeeDetail: {screen: Screens.AttendeeDetail},
  },
  DefaultStackConfig
);

const ScheduleStackNavigator = createStackNavigator(
  {
    Schedule: {
      screen: ScheduleNavigation,
    },
  },
  DefaultStackConfig
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: {
      screen: Screens.Profile,
    },
  },
  DefaultStackConfig
);

const ContactsNavigator = createStackNavigator(
  {
    Contacts: {
      screen: Screens.Contacts,
    },
  },
  DefaultStackConfig
);

const StaffCheckinListsNavigation = createStackNavigator(
  {
    StaffCheckinListsList: {
      screen: Screens.StaffCheckinLists,
    },
  },
  DefaultStackConfig
);

const PrimaryTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Screens.Home,
    },
    Profile: {screen: ProfileNavigator},
    Schedule: {
      screen: ScheduleStackNavigator,
    },
    Contacts: {screen: ContactsNavigator},
    Menu: {screen: MenuNavigation},
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-home';
        } else if (routeName === 'Profile') {
          iconName = `ios-contact${focused ? '' : '-outline'}`;
        } else if (routeName === 'Schedule') {
          iconName = `ios-calendar${focused ? '' : '-outline'}`;
        } else if (routeName === 'Contacts') {
          iconName = `ios-contacts${focused ? '' : '-outline'}`;
        } else if (routeName === 'Menu') {
          iconName = 'md-menu';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={32} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      style: {backgroundColor: '#333'},
      activeTintColor: '#fff',
    },
  }
);

export default createStackNavigator(
  {
    Primary: {screen: PrimaryTabNavigator},
    AttendeeDetail: {screen: Screens.AttendeeDetail},
    TicketInstructions: {screen: Screens.TicketInstructions},

    CheckedInAttendeeInfo: {screen: Screens.CheckedInAttendeeInfo},
    QRScanner: {screen: QRScannerModalNavigation},
    QRCheckinScanner: {screen: QRCheckinScannerModalNavigation},
    QRContactScanner: {screen: QRContactScannerModalNavigation},
    StaffCheckinLists: {screen: StaffCheckinListsNavigation},

    Details: {screen: Screens.Details},
  },
  {
    ...DefaultStackConfig,
    headerMode: 'none',
    mode: 'modal',
  }
);
