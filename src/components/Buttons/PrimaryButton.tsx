import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
};

export default function PrimaryButton(props: Props) {
  return (
    <Button
      style={styles.PrimaryButton}
      uppercase={false}
      mode="contained"
      onPress={props.onPress}>
      {props.children}
    </Button>
  );
}

const styles = StyleSheet.create({
  PrimaryButton: {
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
  },
});
