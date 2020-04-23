import {useNavigation} from '@react-navigation/native';
import React from 'react';

import {PrimaryTabNavigationProp} from '../navigation/types';

type InjectedNavigationProps = {
  navigation: PrimaryTabNavigationProp<'Profile'>;
};

const withNavigation = <P extends InjectedNavigationProps>(
  Component: React.ComponentType<P>
): React.FC<Pick<P, Exclude<keyof P, keyof InjectedNavigationProps>>> => (
  props: Pick<P, Exclude<keyof P, keyof InjectedNavigationProps>>
) => {
  const navigation = useNavigation<PrimaryTabNavigationProp<'Profile'>>();
  return <Component {...(props as P)} navigation={navigation} />;
};

export default withNavigation;
