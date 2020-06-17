import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useContext} from 'react';

import DataContext from '../context/DataContext';
import Screens from '../screens';
import {ScheduleDay} from '../typings/data';
import {ScheduleDayTabParamList} from '../typings/navigation';

const Tab = createMaterialTopTabNavigator<ScheduleDayTabParamList>();

export default function DynamicScheduleNavigation() {
  const {event} = useContext(DataContext);
  let fullSchedule: ScheduleDay[] = [];
  if (event?.groupedSchedule) {
    fullSchedule = event.groupedSchedule as ScheduleDay[];
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
          key={index}
          name={day?.title ? day.title : index}
          component={Screens.ScheduleDay}
          initialParams={{
            day: day?.title ? day.title : '',
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
