import React from 'react';
import {Text, StyleProp, TextStyle} from 'react-native';

type Props = {
  style: StyleProp<TextStyle>;
};

export function RegularText(props: Props) {
  return (
    <Text
      {...props}
      style={[
        {backgroundColor: 'transparent'},
        props.style,
        {fontFamily: 'open-sans'},
      ]}
    />
  );
}

export function SemiBoldText(props: Props) {
  return (
    <Text
      {...props}
      style={[
        {backgroundColor: 'transparent'},
        props.style,
        {fontFamily: 'open-sans-semibold'},
      ]}
    />
  );
}

export function BoldText(props: Props) {
  return (
    <Text
      {...props}
      style={[
        {backgroundColor: 'transparent'},
        props.style,
        {fontFamily: 'open-sans-bold'},
      ]}
    />
  );
}
