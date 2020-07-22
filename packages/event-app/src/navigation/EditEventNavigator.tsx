import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';

import Screens from '../screens';
import {EditEventParamList} from '../typings/navigation';

const Tab = createMaterialTopTabNavigator<EditEventParamList>();

export default function EditEventNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {backgroundColor: '#333'},
        activeTintColor: '#fff',
        scrollEnabled: true,
      }}>
      <Tab.Screen name="Main" component={Screens.Main} />
      <Tab.Screen name="Details" component={Screens.AdminDetails} />
      <Tab.Screen name="CallForPaper" component={Screens.CallForPaper} />
      <Tab.Screen name="Social" component={Screens.Social} />
      <Tab.Screen name="Invoice" component={Screens.Invoice} />
    </Tab.Navigator>
  );
}
