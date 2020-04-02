import React from 'react';
import {Animated, ScrollView} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';

class ScrollViewRef extends React.Component {
  render() {
    return <ScrollView ref={this.props.scrollRef} {...this.props} />;
  }
}

const AnimatedComponent = Animated.createAnimatedComponent(ScrollViewRef);

const AnimatedScrollView = function(props) {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return <AnimatedComponent {...props} scrollRef={ref} />;
};

export default AnimatedScrollView;
