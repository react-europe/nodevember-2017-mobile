import Constants from 'expo-constants';
import React from 'react';
import {
  Animated,
  Platform,
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import {useTheme, Theme} from 'react-native-paper';

import useHeaderHeight from '../utils/useHeaderHeight';

type Props = {
  style?: StyleProp<TextStyle>;
  animatedBackgroundOpacity?: Animated.AnimatedInterpolation;
  renderLeftButton?: () => React.ReactNode;
  renderRightButton?: () => React.ReactNode;
  renderTitle?: () => React.ReactNode;
};

export default function NavigationBar(props: Props) {
  const headerHeight = useHeaderHeight();
  const theme: Theme = useTheme();
  const _renderAnimated = () => {
    return (
      <>
        <View
          style={[
            styles.navigationBarContainer,
            {height: headerHeight},
            props.style,
          ]}
          pointerEvents="none">
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: theme.colors.primary,
                opacity: props.animatedBackgroundOpacity,
              },
            ]}
          />
        </View>

        <View style={styles.navigationBarLeftButton}>
          {props.renderLeftButton && props.renderLeftButton()}
        </View>

        <View
          style={[styles.navigationBarTitleContainer, {height: headerHeight}]}
          pointerEvents="none">
          {props.renderTitle && props.renderTitle()}
        </View>

        <View style={styles.navigationBarRightButton}>
          {props.renderRightButton && props.renderRightButton()}
        </View>
      </>
    );
  };

  const _renderStatic = () => {
    return (
      <View style={[styles.navigationBarContainer, {height: headerHeight}]}>
        <View style={styles.navigationBarLeftButton}>
          {props.renderLeftButton && props.renderLeftButton()}
        </View>

        <View
          style={[styles.navigationBarTitleContainer, {height: headerHeight}]}>
          {props.renderTitle && props.renderTitle()}
        </View>

        <View style={styles.navigationBarRightButton}>
          {props.renderRightButton && props.renderRightButton()}
        </View>
      </View>
    );
  };

  if (props.animatedBackgroundOpacity) {
    return _renderAnimated();
  } else {
    return _renderStatic();
  }
}

// Didn't want to investigate why I needed to offset this a bit, surely there is a good reason
const MADE_UP_NUMBER = 7;
const PADDING_TOP =
  Platform.OS === 'ios' ? Constants.statusBarHeight : MADE_UP_NUMBER;

const styles = StyleSheet.create({
  navigationBarContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    paddingTop: PADDING_TOP,
    top: 0,
    left: 0,
    right: 0,
  },
  navigationBarTitleContainer: {
    left: 0,
    right: 0,
    paddingTop: PADDING_TOP,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
    position: 'absolute',
  },
  navigationBarLeftButton: {
    width: 80,
    top: PADDING_TOP,
    position: 'absolute',
  },
  navigationBarRightButton: {
    top: PADDING_TOP,
    width: 80,
    right: Platform.OS === 'android' ? 8 : 0,
    bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
  },
});
