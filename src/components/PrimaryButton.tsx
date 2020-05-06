import React from 'react';
import {StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Theme, useTheme} from 'react-native-paper';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
};

export default function PrimaryButton(props: Props) {
  const theme: Theme = useTheme();
  return (
    <RectButton
      style={[styles.PrimaryButton, {backgroundColor: theme.colors.primary}]}
      onPress={props.onPress}>
      {props.children}
    </RectButton>
  );
}

const styles = StyleSheet.create({
  PrimaryButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 3,
    flexDirection: 'row',
  },
});
