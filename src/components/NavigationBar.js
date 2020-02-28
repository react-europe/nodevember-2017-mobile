import React from 'react';
import {Animated, Platform, View, StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import {Colors, Layout} from '../constants';

export default class NavigationBar extends React.Component {
  render() {
    if (this.props.animatedBackgroundOpacity) {
      return this._renderAnimated();
    } else {
      return this._renderStatic();
    }
  }

  _renderAnimated = () => {
    return (
      <>
        <View style={[styles.navigationBarContainer, this.props.style]} pointerEvents="none">
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Colors.blue,
                opacity: this.props.animatedBackgroundOpacity,
              },
            ]}
          />
        </View>

        <View style={styles.navigationBarLeftButton}>
          {this.props.renderLeftButton && this.props.renderLeftButton()}
        </View>

        <View style={styles.navigationBarTitleContainer} pointerEvents="none">
          {this.props.renderTitle && this.props.renderTitle()}
        </View>

        <View style={styles.navigationBarRightButton}>
          {this.props.renderRightButton && this.props.renderRightButton()}
        </View>
      </>
    );
  };

  _renderStatic = () => {
    return (
      <View style={styles.navigationBarContainer}>
        <View style={styles.navigationBarLeftButton}>
          {this.props.renderLeftButton && this.props.renderLeftButton()}
        </View>

        <View style={styles.navigationBarTitleContainer}>
          {this.props.renderTitle && this.props.renderTitle()}
        </View>

        <View style={styles.navigationBarRightButton}>
          {this.props.renderRightButton && this.props.renderRightButton()}
        </View>
      </View>
    );
  };
}

// Didn't want to investigate why I needed to offset this a bit, surely there is a good reason
const MADE_UP_NUMBER = 7;
const PADDING_TOP =
  Platform.OS === 'ios' ? Constants.statusBarHeight : MADE_UP_NUMBER;

const styles = StyleSheet.create({
  navigationBarContainer: {
    backgroundColor: 'transparent',
    height: Layout.headerHeight,
    position: 'absolute',
    paddingTop: PADDING_TOP,
    top: 0,
    left: 0,
    right: 0,
  },
  navigationBarTitleContainer: {
    left: 0,
    right: 0,
    height: Layout.headerHeight,
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
