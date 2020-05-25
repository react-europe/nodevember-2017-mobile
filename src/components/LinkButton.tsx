import {useLinkProps, NavigationAction} from '@react-navigation/native';
import React from 'react';
import {Platform, TouchableOpacity, Text, View} from 'react-native';

type Props = {
  to: string;
  action?: NavigationAction;
  children: React.ReactNode;
};

export default function LinkButton({to, action, children, ...rest}: Props) {
  const {onPress, ...props} = useLinkProps({to, action});

  const [isHovered, setIsHovered] = React.useState(false);

  if (Platform.OS === 'web') {
    return (
      <View
        onClick={onPress}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{transitionDuration: '150ms', opacity: isHovered ? 0.5 : 1}}
        {...props}
        {...rest}>
        <Text>{children}</Text>
      </View>
    );
  }

  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}
