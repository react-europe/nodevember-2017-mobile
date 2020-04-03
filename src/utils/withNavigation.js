import React from 'react';
import {useNavigation} from '@react-navigation/native';

export function withNavigation(Component) {
  return function WrappedWithNavigation(props) {
    const navigation = useNavigation();
    return <Component {...props} navigation={navigation} />;
  };
}

export default withNavigation;
