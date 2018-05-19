import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { View, Text, StatusBar } from 'react-native'
import { TabNavigator, StackNavigator } from 'react-navigation'

import Schedule from './data/schedule.json'
import moment from 'moment'
import { Colors, FontSizes, Layout } from './constants'
import TabBarBottom from './components/TabBarBottom'

import Screens from './screens'
import QRScannerModalNavigation from './screens/QRScreens/Identify'
import QRCheckinScannerModalNavigation from './screens/QRScreens/CheckIn'
import QRContactScannerModalNavigation from './screens/QRScreens/Contact'
import Ionicons from '@expo/vector-icons/Ionicons'

const FullSchedule = Schedule.events[0].groupedSchedule
let navSchedule = {}
_.each(FullSchedule, (day, i) => {
  navSchedule[day.title] = {
    screen: Screens.ScheduleDay({
      day: day.title,
      date: moment(new Date(day.date)).format('ddd')
    })
  }
})

const ScheduleNavigation = TabNavigator(navSchedule, {
  lazy: false,
  swipeEnabled: true,
  animationEnabled: true,
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'top',
  tabBarOptions: {
    style: { backgroundColor: '#333' },
    activeTintColor: '#fff',
    showLabel: false
  },
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => {
      const { routeName } = navigation.state
      // You can return any component that you like here! We usually use an
      // icon component from react-native-vector-icons
      return (
        <Text style={{ color: tintColor, fontWeight: '800', fontSize: 18 }}>
          {routeName.substring(0, 3).toUpperCase()}
        </Text>
      )
    }
  })
})

const DefaultStackConfig = {
  cardStyle: {
    backgroundColor: '#fafafa'
  }
}

const ExtraMenuNavigation = StackNavigator(
  {
    Menu: { screen: Screens.ExtraMenu },
    Speakers: { screen: Screens.Speakers },
    Crew: { screen: Screens.Crew },
    Sponsors: { screen: Screens.Sponsors }
  },
  {
    ...DefaultStackConfig,
    navigationOptions: {
      headerStyle: { backgroundColor: Colors.blue },
      headerTintColor: 'white'
    }
  }
)

const ScheduleStackNavigator = StackNavigator({
  Schedule: {
    screen: ScheduleNavigation,
    navigationOptions: {
      title: 'Schedule',
      headerStyle: { backgroundColor: Colors.blue },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontFamily: 'open-sans-bold'
      }
    }
  }
})

const ProfileNavigator = StackNavigator({
  Profile: {
    screen: Screens.Profile,
    navigationOptions: {
      title: 'Profile',
      headerStyle: { backgroundColor: Colors.blue },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontFamily: 'open-sans-bold'
      }
    }
  }
})

const ContactsNavigator = StackNavigator({
  Contacts: {
    screen: Screens.Contacts,
    navigationOptions: {
      title: 'Contacts',
      headerStyle: { backgroundColor: Colors.blue },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontFamily: 'open-sans-bold'
      }
    }
  }
})

const PrimaryTabNavigator = TabNavigator(
  {
    Home: {
      screen: Screens.Home
    },
    Profile: { screen: ProfileNavigator },
    Schedule: {
      screen: ScheduleStackNavigator,
      navigationOptions: {
        title: 'Schedule',
        headerTitleStyle: {
          fontFamily: 'open-sans-bold'
        }
      }
    },
    Contacts: { screen: ContactsNavigator },
    ExtraMenu: { screen: ExtraMenuNavigation }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Home') {
          iconName = 'ios-home'
        } else if (routeName === 'Profile') {
          iconName = `ios-contact${focused ? '' : '-outline'}`
        } else if (routeName === 'Schedule') {
          iconName = `ios-calendar${focused ? '' : '-outline'}`
        } else if (routeName === 'Contacts') {
          iconName = `ios-contacts${focused ? '' : '-outline'}`
        } else if (routeName === 'ExtraMenu') {
          iconName = 'md-menu'
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={32} color={tintColor} />
      }
    }),
    tabBarOptions: {
      style: { backgroundColor: '#333' },
      activeTintColor: '#fff',
      showLabel: false
    }
  }
)

export default StackNavigator(
  {
    Primary: { screen: PrimaryTabNavigator },
    QRScanner: { screen: QRScannerModalNavigation },
    QRCheckinScanner: { screen: QRCheckinScannerModalNavigation },
    QRContactScanner: { screen: QRContactScannerModalNavigation },
    Details: { screen: Screens.Details }
  },
  {
    ...DefaultStackConfig,
    headerMode: 'none',
    mode: 'modal'
  }
)
