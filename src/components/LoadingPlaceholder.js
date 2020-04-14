import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Platform, View} from 'react-native';
import {Colors} from '../constants';

// All this does is briefly render a loading indicator when you
// first mount a component as a child of this component
export default function LoadingPlaceholder(props) {
  const [isReady, setIsReady] = useState(false);
  let timer = undefined;

  useEffect(() => {
    if (!isReady) {
      timer = setTimeout(
        () => {
          setIsReady(true);
        },
        Platform.OS === 'ios' ? 250 : 500
      );
    }
    return function unmount() {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    };
  }, []);

  if (!isReady) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator
          color={Platform.OS === 'android' ? Colors.blue : '#888'}
          size="large"
        />
      </View>
    );
  } else {
    return props.children;
  }
}
