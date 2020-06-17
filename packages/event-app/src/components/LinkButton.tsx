import {useLinkProps, NavigationAction} from '@react-navigation/native';
import React from 'react';
import {
  Platform,
  TouchableOpacity,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

type Props = {
  to: string;
  action?: NavigationAction;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function LinkButton({to, action, children, ...rest}: Props) {
  const {onPress, ...props} = useLinkProps({to, action});

  if (Platform.OS === 'web') {
    return (
      <View onClick={onPress} {...props} {...rest}>
        <Text>{children}</Text>
      </View>
    );
  }

  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}
