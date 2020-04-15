import React from 'react';
import {BorderlessButton} from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';
import {Icons} from '../constants';
import {toggleSaved, withSaveState} from '../utils/storage';

function SaveButton(props) {
  const _handlePress = () => {
    toggleSaved(props.talk);
  };

  return (
    <BorderlessButton
      onPress={_handlePress}
      style={{
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
        paddingLeft: 15,
        paddingRight: 15,
      }}
      hitSlop={{left: 30, top: 30, right: 30, bottom: 30}}>
      <Ionicons
        name={props.saved ? Icons.favoriteActive : Icons.favorite}
        size={25}
        color="#fff"
        style={{backgroundColor: 'transparent'}}
      />
    </BorderlessButton>
  );
}

export default withSaveState(SaveButton);
