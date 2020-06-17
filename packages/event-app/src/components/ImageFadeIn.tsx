import React from 'react';
import {Platform, StyleProp, ViewStyle} from 'react-native';
import FadeIn from 'react-native-fade-in-image';

type ImageFadeInProps = {
  children: React.ReactNode;
  placeholderStyle?: StyleProp<ViewStyle>;
};

export default function ImageFadeIn(props: ImageFadeInProps) {
  if (Platform.OS === 'web') return <>{props.children}</>;
  return (
    <FadeIn placeholderStyle={props.placeholderStyle}>{props.children}</FadeIn>
  );
}
