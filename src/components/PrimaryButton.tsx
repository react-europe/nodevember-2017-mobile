import '@expo/match-media';
import React from 'react';
import {StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Theme, useTheme} from 'react-native-paper';
import {useMediaQuery} from 'react-responsive';
import {View} from 'react-native-animatable';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
};

export default function PrimaryButton(props: Props) {
  const theme: Theme = useTheme();

  const isTabletOrMobileDevice = useMediaQuery({
    maxDeviceWidth: 1224,
    query: '(max-device-width: 1224px)',
  });

  if (isTabletOrMobileDevice) {
    return (
      <RectButton
        style={[styles.PrimaryButton, {backgroundColor: 'limegreen'}]}
        onPress={props.onPress}>
        {props.children}
      </RectButton>
    );
  }
  return (
    <View style={[styles.centerContainer, {backgroundColor: 'teal'}]}>
      <RectButton
        style={[styles.PrimaryButtonWeb, {backgroundColor: 'salmon'}]}
        onPress={props.onPress}>
        {props.children}
      </RectButton>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
  },
  PrimaryButtonWeb: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 3,
    flexDirection: 'row',
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
