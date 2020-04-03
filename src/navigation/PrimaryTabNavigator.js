import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Screens from '../screens';
import {withData} from '../context/DataContext';

const Tab = createBottomTabNavigator();

function PrimaryTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={withData(Screens.Home)} />
    </Tab.Navigator>
  );
}

export default PrimaryTabNavigator;
