import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';

export default function OverscrollView() {
  const theme = useTheme();
  return (
    <View
      style={{
        position: 'absolute',
        top: -400,
        height: 400,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
      }}
    />
  );
}
