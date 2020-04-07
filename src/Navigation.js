import React from 'react';
import _ from 'lodash';
import {createStackNavigator} from '@react-navigation/stack';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import moment from 'moment';
import {Colors} from './constants';

import Screens from './screens';
import QRScannerModalNavigation from './screens/QRScreens/Identify';
import QRCheckinScannerModalNavigation from './screens/QRScreens/CheckIn';
import QRContactScannerModalNavigation from './screens/QRScreens/Contact';
import Ionicons from '@expo/vector-icons/Ionicons';
import {withData} from './context/DataContext';

class DynamicScheduleNavigation extends React.Component {
  state = {
    navigator: null,
  };

  componentDidMount() {
    this.initializeNavigatorFromSchedule();
  }

  componentDidUpdate() {
    // @todo: if schedule changes, re-render navigator? probably only if days changed tho
  }

  initializeNavigatorFromSchedule() {
    // @todo: get schedule from network or disk
    const fullSchedule = this.props.event.groupedSchedule; // Schedule.events[0].groupedSchedule;

    // Sort schedule
    let navSchedule = {};
    _.each(fullSchedule, (day, i) => {
      navSchedule[day.title] = {
        screen: withData(
          Screens.ScheduleDay({
            day: day.title,
            date: moment(new Date(day.date)).format('ddd'),
          })
        ),
      };
    });

    const navigator = createCompatNavigatorFactory(
      createMaterialTopTabNavigator
    )(navSchedule, {
      tabBarOptions: {
        style: {backgroundColor: '#333'},
        activeTintColor: '#fff',
      },
      defaultNavigationOptions: ({route}) => ({
        tabBarLabel: route.name.substring(0, 3).toUpperCase(),
      }),
    });

    this.setState({navigator});
  }

  render() {
    if (!this.state.navigator) {
      // @todo: show a loading state
      return null;
    }

    let Navigator = this.state.navigator;
    return <Navigator detached {...this.props} />;
  }
}

const DefaultStackConfig = {
  cardStyle: {
    backgroundColor: '#fafafa',
  },
  defaultNavigationOptions: (/* {navigation} */) => ({
    title: /* navigation.state.routeName */ 'Title',
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

const MenuNavigation = createCompatNavigatorFactory(createStackNavigator)(
  {
    Menu: {screen: Screens.Menu},
    Speakers: {screen: withData(Screens.Speakers)},
    Crew: {screen: withData(Screens.Crew)},
    Sponsors: {screen: withData(Screens.Sponsors)},
    Attendees: {screen: withData(Screens.Attendees)},
    AttendeeDetail: {screen: Screens.AttendeeDetail},
  },
  DefaultStackConfig
);

const ScheduleStackNavigator = createCompatNavigatorFactory(
  createStackNavigator
)(
  {
    Schedule: {
      screen: withData(DynamicScheduleNavigation),
    },
  },
  DefaultStackConfig
);

const ProfileNavigator = createCompatNavigatorFactory(createStackNavigator)(
  {
    Profile: {
      screen: Screens.Profile,
    },
  },
  DefaultStackConfig
);

const ContactsNavigator = createCompatNavigatorFactory(createStackNavigator)(
  {
    Contacts: {
      screen: Screens.Contacts,
    },
  },
  DefaultStackConfig
);

const StaffCheckinListsNavigation = createCompatNavigatorFactory(
  createStackNavigator
)(
  {
    StaffCheckinListsList: {
      screen: Screens.StaffCheckinLists,
    },
  },
  DefaultStackConfig
);

const PrimaryTabNavigator = createCompatNavigatorFactory(
  createBottomTabNavigator
)(
  {
    Home: {
      screen: withData(Screens.Home),
    },
    Profile: {screen: ProfileNavigator},
    Schedule: {
      screen: ScheduleStackNavigator,
    },
    Contacts: {screen: ContactsNavigator},
    Menu: {screen: MenuNavigation},
  },
  {
    defaultNavigationOptions: (/* {navigation} */) => ({
      /* tabBarIcon: ({focused, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'ios-home';
        } else if (routeName === 'Profile') {
          iconName = `ios-contact${focused ? '' : ''}`;
        } else if (routeName === 'Schedule') {
          iconName = `ios-calendar${focused ? '' : ''}`;
        } else if (routeName === 'Contacts') {
          iconName = `ios-contacts${focused ? '' : ''}`;
        } else if (routeName === 'Menu') {
          iconName = 'md-menu';
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={32} color={tintColor} />;
      }, */
    }),
    tabBarOptions: {
      style: {backgroundColor: '#333'},
      activeTintColor: '#fff',
    },
  }
);

const Navigation = createCompatNavigatorFactory(createStackNavigator)(
  {
    Primary: {screen: PrimaryTabNavigator},
    AttendeeDetail: {screen: Screens.AttendeeDetail},
    TicketInstructions: {screen: Screens.TicketInstructions},

    /* CheckedInAttendeeInfo: {screen: Screens.CheckedInAttendeeInfo}, */
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

export default Navigation;
