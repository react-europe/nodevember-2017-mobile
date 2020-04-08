import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';

import Screens from '../screens';
import {withData} from '../context/DataContext';

const Tab = createMaterialTopTabNavigator();

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
            component={Screens.ScheduleDay}
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

export default withData(DynamicScheduleNavigation);
