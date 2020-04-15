import React from 'react';
import {View, Platform, StyleSheet} from 'react-native';

import {Ionicons} from '@expo/vector-icons';
import {BorderlessButton} from 'react-native-gesture-handler';

CloseButton.defaultProps = {
  pressColorAndroid: 'rgba(0, 0, 0, .32)',
  tintColor: Platform.select({
    ios: '#037aff',
  }),
};

function CloseButton(props) {
  const {onPress, pressColorAndroid} = props;

  return (
    <BorderlessButton
      accessibilityComponentType="button"
      accessibilityLabel="Close details"
      accessibilityTraits="button"
      testID="header-back"
      delayPressIn={0}
      onPress={onPress}
      pressColor={pressColorAndroid}
      style={styles.container}
      borderless>
      <View style={styles.container}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
          size={Platform.OS === 'ios' ? 40 : 30}
          color="#fff"
          style={styles.icon}
        />
      </View>
    </BorderlessButton>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  icon: {
    margin: 16,
    marginTop: 0,
  },
});

export default CloseButton;
