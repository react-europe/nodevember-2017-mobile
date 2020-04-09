import React from 'react';
import {useHeaderHeight} from '@react-navigation/stack';
import {Platform} from 'react-native';

import {Layout} from '../constants';

export function withHeaderHeight(Component) {
  return function WrappedWithNavigation(props) {
    const headerHeight = useHeaderHeight();
    return (
      <Component
        {...props}
        headerHeight={
          Platform.OS === 'android'
            ? headerHeight
            : headerHeight + Layout.notchHeight
        }
      />
    );
  };
}

export default withHeaderHeight;
