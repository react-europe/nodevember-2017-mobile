import {Ionicons} from '@expo/vector-icons';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useContext, useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';

import ScheduleModal from '../components/ScheduleModal';
import DataContext from '../context/DataContext';
import Screens from '../screens';
import {ScheduleDay} from '../typings/data';
import {
  ScheduleDayTabParamList,
  ScheduleNavigationProp,
} from '../typings/navigation';
import {occurence} from '../utils/array';

const Tab = createMaterialTopTabNavigator<ScheduleDayTabParamList>();

export default function DynamicScheduleNavigation({
  navigation,
}: {
  navigation: ScheduleNavigationProp;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  if (Platform.OS !== 'web') {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
            size={24}
            color="#FFF"
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
      ),
    });
  }
  const {event} = useContext(DataContext);
  let fullSchedule: ScheduleDay[] = [];
  if (event?.groupedSchedule) {
    fullSchedule = event.groupedSchedule as ScheduleDay[];
  }

  return (
    <View style={{flex: 1}}>
      {Platform.OS !== 'web' && (
        <ScheduleModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      <Tab.Navigator
        tabBarOptions={{
          style: {backgroundColor: '#333'},
          activeTintColor: '#fff',
          scrollEnabled: true,
        }}>
        {fullSchedule.map((day: ScheduleDay, index: number) => {
          const dayOccurence = occurence(fullSchedule, 'title', day.title);
          let dayTitle: string = day?.title
            ? day.title.substring(0, 3).toUpperCase()
            : index.toString();
          if (dayOccurence > 1) {
            const monthDay = new Date(day.date).getDate();
            dayTitle += '-' + monthDay.toString();
          }
          return (
            <Tab.Screen
              key={index}
              name={`${event?.name}-${dayTitle}`}
              options={{title: dayTitle}}
              component={Screens.ScheduleDay}
              initialParams={{
                day: day.title ? day.title : '',
                date: day.date ? day.date : '',
              }}
            />
          );
        })}
      </Tab.Navigator>
    </View>
  );
}
