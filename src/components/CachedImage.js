import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import sha256 from 'crypto-js/sha256';

export default class CachedImage extends React.Component {
  state = {
    source: null,
  };

  unmounting = false;

  async componentDidMount() {
    let source = this.props.source;

    try {
      if (typeof source === 'number') {
        await Asset.fromModule(source).downloadAsync();
      } else if (source && source.uri) {
        let name = sha256(source.uri);
        let filepath = `${FileSystem.documentDirectory}${name}.png'`;
        let {exists} = await FileSystem.getInfoAsync(filepath);
        if (exists) {
          source = {uri: filepath};
        } else {
          let {uri} = await FileSystem.downloadAsync(source.uri, filepath);
          source = {uri};
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (!this.unmounting) {
        this.setState({source});
      }
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  render() {
    if (this.state.source) {
      return <Image {...this.props} source={this.state.source} />;
    } else {
      let safeImageStyle = {...StyleSheet.flatten(this.props.style)};
      delete safeImageStyle.tintColor;
      delete safeImageStyle.resizeMode;
      return <View style={[{backgroundColor: '#eee'}, safeImageStyle]} />;
    }
  }
}
