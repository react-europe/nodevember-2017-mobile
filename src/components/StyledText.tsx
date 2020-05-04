import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {Text} from 'react-native-paper';

import {FontSizes} from '../constants';

type Props = {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  fontSize?: keyof typeof FontSizes;
};

interface CustomTextProps extends Props {
  fontFamily: string;
}

function CustomText<P extends CustomTextProps>(props: P) {
  const fontSize = props.fontSize ? FontSizes[props.fontSize] : FontSizes.title;
  return (
    <Text
      {...(props as P)}
      style={[
        {backgroundColor: 'transparent'},
        props.style,
        {fontSize},
        {fontFamily: props.fontFamily},
      ]}
    />
  );
}

export function RegularText<P extends Props>(props: P) {
  return <CustomText fontFamily="open-sans" {...(props as P)} />;
}

export function SemiBoldText<P extends Props>(props: P) {
  return <CustomText fontFamily="open-sans-semibold" {...(props as P)} />;
}

export function BoldText<P extends Props>(props: P) {
  return <CustomText fontFamily="open-sans-bold" {...(props as P)} />;
}
