import React, {useEffect, useState} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';
import sha256 from 'crypto-js/sha256';

export default function CachedImage(props) {
  const [source, setSource] = useState(null);

  let unmounting = false;

  async function fetchPicture() {
    let source = props.source;

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
      if (!unmounting) {
        setSource(source);
      }
    }
  }

  useEffect(() => {
    fetchPicture();
    return function unmount() {
      unmounting = true;
    };
  }, []);

  if (source) {
    return <Image {...props} source={source} />;
  } else {
    let safeImageStyle = {...StyleSheet.flatten(props.style)};
    delete safeImageStyle.tintColor;
    delete safeImageStyle.resizeMode;
    return <View style={[{backgroundColor: '#eee'}, safeImageStyle]} />;
  }
}
