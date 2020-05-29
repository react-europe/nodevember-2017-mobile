import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import {useCurrentScreenWidth} from '../utils/useScreenWidth';

export default function DrawerOpenButton(navigation) {
  const isLargeScreen = useCurrentScreenWidth();
  if (isLargeScreen || Platform.OS !== 'web') {
    return {};
  }
  return {
    headerLeft: () => (
      <Button onPress={() => navigation.openDrawer()}>
        <Ionicons name="md-menu" size={30} style={styles.icon} />
      </Button>
    ),
    cardStyle: {flex: 1},
  };
}

const styles = StyleSheet.create({
  icon: {
    color: '#FFF',
  },
});
