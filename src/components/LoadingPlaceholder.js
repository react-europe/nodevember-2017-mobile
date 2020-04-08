import React from 'react';
import {ActivityIndicator, Platform, View} from 'react-native';
import {Colors} from '../constants';

// All this does is briefly render a loading indicator when you
// first mount a component as a child of this component
export default class LoadingPlaceholder extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    if (!this.state.isReady) {
      this.timer = setTimeout(
        () => {
          this.setState({isReady: true});
        },
        Platform.OS === 'ios' ? 250 : 500
      );
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
  }

  render() {
    if (!this.state.isReady) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            color={Platform.OS === 'android' ? Colors.blue : '#888'}
            size="large"
          />
        </View>
      );
    } else {
      return this.props.children;
    }
  }
}
