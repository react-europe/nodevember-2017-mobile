import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import moment from 'moment';
import React from 'react';

import {withData} from '../context/DataContext';
import {ScheduleDay, Event} from '../data/data';
import Screens from '../screens';

type Props = {
  event: Event;
};

const Tab = createMaterialTopTabNavigator();

function DynamicScheduleNavigation(props: Props) {
  let fullSchedule: ScheduleDay[] = [];
  if (props.event.groupedSchedule) {
    fullSchedule = props.event.groupedSchedule as ScheduleDay[];
  }
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {backgroundColor: '#333'},
        activeTintColor: '#fff',
      }}
      screenOptions={({route}) => ({
        tabBarLabel: route.name.substring(0, 3).toUpperCase(),
      })}>
      {fullSchedule.map((day: ScheduleDay, index: number) => (
        <Tab.Screen
          key={day.title || index}
          name={day.title || index.toString()}
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

export default withData(DynamicScheduleNavigation);
