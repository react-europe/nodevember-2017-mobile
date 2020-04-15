import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Video} from 'expo-av';
import {Asset} from 'expo-asset';
import {View as AnimatableView} from 'react-native-animatable';

export default function VideoBackground() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  async function loadVideo() {
    if (videoLoaded) {
      try {
        await Asset.fromModule(require('../assets/video.mp4')).downloadAsync();
        setVideoLoaded(true);
      } catch (e) {
        // Not working, oh well, no video for you
      }
    }
  }

  useEffect(() => {
    loadVideo();
  }, []);

  if (videoLoaded) {
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
