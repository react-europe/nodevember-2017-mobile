import React from 'react';
import {RectButton} from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native'
import ClipBorderRadius from './ClipBorderRadius';
import { BORDER_RADIUS, FontSizes, Colors } from '../constants';
import {SemiBoldText} from './StyledText';

const BigButton = ({
  buttonStyle = {},
  textStyle = {},
  onPress,
  children = 'Big Button',
  icon = null,
  ...rest
}) => (
  <ClipBorderRadius>
    <RectButton
      style={[styles.bigButton, buttonStyle]}
      onPress={onPress}
      underlayColor="#fff"
      {...rest}>
      {icon ? icon : null}
      <SemiBoldText style={[styles.bigButtonText, textStyle]}>
        {children}
      </SemiBoldText>
    </RectButton>
  </ClipBorderRadius>
);

const styles = StyleSheet.create({
  bigButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    flexDirection: 'row',
    marginTop: 10,
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center',
  }
})

export default BigButton
