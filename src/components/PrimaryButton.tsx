import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {View} from 'react-native-animatable';
import {RectButton} from 'react-native-gesture-handler';
import {Theme, useTheme} from 'react-native-paper';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
};

export default function PrimaryButton(props: Props) {
  const {colors}: Theme = useTheme();

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.centerContainer]}>
        <RectButton
          style={[
            styles.PrimaryButton,
            {backgroundColor: colors.primary},
            styles.PrimaryButtonWeb,
          ]}
          onPress={props.onPress}>
          {props.children}
        </RectButton>
      </View>
    );
  }

  return (
    <RectButton
      style={[styles.PrimaryButton, {backgroundColor: colors.primary}]}
      onPress={props.onPress}>
      {props.children}
    </RectButton>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
  },
  PrimaryButtonWeb: {
    width: '400px',
  },
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
