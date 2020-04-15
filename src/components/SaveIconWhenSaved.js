import React from 'react';
import {Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {withSaveState} from '../utils/storage';
import {Icons, Colors} from '../constants';

function SaveIconWhenSaved(props) {
  if (!props.saved) {
    return null;
  }

  const icon = (
    <Ionicons
      name={Icons.favoriteActive}
      color={Colors.blue}
      style={[{backgroundColor: 'transparent'}, props.style]}
    />
  );

  return (
    <Text>
      {icon}
      {'  '}
    </Text>
  );
}

export default withSaveState(SaveIconWhenSaved);
