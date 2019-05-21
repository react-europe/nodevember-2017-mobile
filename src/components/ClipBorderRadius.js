import React from 'react'
import { View } from 'react-native'
import { BORDER_RADIUS } from '../constants';

const ClipBorderRadius = ({children, style}) => {
  return (
    <View style={[{borderRadius: BORDER_RADIUS, overflow: 'hidden'}, style]}>
      {children}
    </View>
  );
};

export default ClipBorderRadius;
