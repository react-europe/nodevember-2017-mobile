import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {Text, withTheme, Theme} from 'react-native-paper';

import {FontSizes} from '../constants';

type Props = {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  fontSize?: keyof typeof FontSizes;
  accent?: boolean;
};

interface CustomTextProps extends Props {
  fontFamily: string;
  theme: Theme;
}

function CustomText<P extends CustomTextProps>(props: P) {
  const colors = props.theme.colors;
  const fontSize = props.fontSize ? FontSizes[props.fontSize] : FontSizes.title;
  const textColor = props.accent ? colors.accent : colors.text;
  return (
    <Text
      {...(props as P)}
      style={[
        {backgroundColor: 'transparent'},
        {color: textColor},
        {fontSize},
        {fontFamily: props.fontFamily},
        props.style,
      ]}
    />
  );
}

const CustomTextWithTheme = withTheme(CustomText);

export function RegularText<P extends Props>(props: P) {
  return <CustomTextWithTheme fontFamily="open-sans" {...(props as P)} />;
}

export function SemiBoldText<P extends Props>(props: P) {
  return (
    <CustomTextWithTheme fontFamily="open-sans-semibold" {...(props as P)} />
  );
}

export function BoldText<P extends Props>(props: P) {
  return <CustomTextWithTheme fontFamily="open-sans-bold" {...(props as P)} />;
}
