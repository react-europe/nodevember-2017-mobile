import {useHeaderHeight} from '@react-navigation/stack';
import React from 'react';
import {Platform} from 'react-native';

import {Layout} from '../constants';

const withHeaderHeight = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => (props) => {
  const headerHeight = useHeaderHeight();
  return (
    <Component
      {...(props as P)}
      headerHeight={
        Platform.OS === 'android'
          ? headerHeight
          : headerHeight + Layout.notchHeight
      }
    />
  );
};

export default withHeaderHeight;
