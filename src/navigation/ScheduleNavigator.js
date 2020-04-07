import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';

import DefaultStackConfig from '../utils/defaultNavConfig';
import Screens from '../screens';
import {withData} from '../context/DataContext';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function ScheduleNavigator() {
  return (
    <Stack.Navigator screenOptions={route => ({...DefaultStackConfig(route)})}>
      <Stack.Screen
        name="Schedule"
        component={withData(DynamicScheduleNavigation)}
      />
    </Stack.Navigator>
  );
}

export default ScheduleNavigator;

class DynamicScheduleNavigation extends React.Component {
  render() {
    const fullSchedule = this.props.event.groupedSchedule;
    return (
      <Tab.Navigator
        tabBarOptions={{
          style: {backgroundColor: '#333'},
          activeTintColor: '#fff',
        }}
        screenOptions={({route}) => ({
          tabBarLabel: route.name.substring(0, 3).toUpperCase(),
        })}>
        {fullSchedule.map(day => (
          <Tab.Screen
            key={day.title}
            name={day.title}
            component={withData(Screens.ScheduleDay)}
            initialParams={{
              day: day.title,
              date: moment(new Date(day.date)).format('ddd'),
            }}
          />
        ))}
      </Tab.Navigator>
    );
  }
}
