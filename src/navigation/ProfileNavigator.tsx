import {Ionicons} from '@expo/vector-icons';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import Screens from '../screens';
import {ProfileStackParamList} from '../typings/navigation';
import DefaultStackConfig from '../utils/defaultNavConfig';

const Stack = createStackNavigator<ProfileStackParamList>();

function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        ...DefaultStackConfig(route),
      })}>
      <Stack.Screen
        name="Profile"
        component={Screens.Profile}
        options={({navigation}) => ({
          headerLeft: () => (
            <Button onPress={() => navigation.openDrawer()}>
              <Ionicons
                name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                size={Platform.OS === 'ios' ? 40 : 30}
                style={styles.icon}
              />
            </Button>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    color: '#FFF',
  },
});

export default ProfileNavigator;
