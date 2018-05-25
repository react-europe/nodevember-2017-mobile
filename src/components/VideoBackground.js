import React from 'react';
import {View} from 'react-native';
import {Asset, Video} from 'expo';
import {View as AnimatableView} from 'react-native-animatable';

export default class VideoBackground extends React.Component {
  state = {
    videoLoaded: false,
  };

  async componentDidMount() {
    if (!this.state.videoLoaded) {
      try {
        await Asset.fromModule(require('../assets/video.mp4')).downloadAsync();
        this.setState({videoLoaded: true});
      } catch (e) {
        // Not working, oh well, no video for you
      }
    }
  }

  render() {
    if (this.state.videoLoaded) {
      return (
        <AnimatableView
          animation="fadeIn"
          style={{flex: 1}}
          useNativeDriver
          duration={5000}>
          <Video
            source={require('../assets/video.mp4')}
            style={{flex: 1}}
            resizeMode="cover"
            shouldPlay
            muted
            isLooping
          />
        </AnimatableView>
      );
    } else {
      return <View style={{flex: 1}} />;
    }
  }
}
