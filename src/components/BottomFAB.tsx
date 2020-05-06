import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FAB, Theme, useTheme} from 'react-native-paper';

type Props = {
  onPress: () => void;
};

export default function BottomFAB(props: Props) {
  const theme: Theme = useTheme();
  return (
    <View style={styles.fixedView}>
      <FAB
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        icon="plus"
        onPress={props.onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    margin: 5,
  },
  fixedView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
