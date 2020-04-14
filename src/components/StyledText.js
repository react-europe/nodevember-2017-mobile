import React from 'react';
import {Text} from 'react-native';

export function RegularText(props) {
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

export function SemiBoldText(props) {
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

export function BoldText(props) {
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
