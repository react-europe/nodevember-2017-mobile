import React from 'react';
import {Text} from 'react-native';

export class RegularText extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[
          {backgroundColor: 'transparent'},
          this.props.style,
          {fontFamily: 'open-sans'},
        ]}
      />
    );
  }
}

export class SemiBoldText extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[
          {backgroundColor: 'transparent'},
          this.props.style,
          {fontFamily: 'open-sans-semibold'},
        ]}
      />
    );
  }
}

export class BoldText extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[
          {backgroundColor: 'transparent'},
          this.props.style,
          {fontFamily: 'open-sans-bold'},
        ]}
      />
    );
  }
}
