import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {View, Image, Text, FlatList, StyleSheet, StatusBar} from 'react-native';
import {useTheme, Theme} from 'react-native-paper';

import CachedImage from '../components/CachedImage';
import LinkButton from '../components/LinkButton';
import {Layout} from '../constants';
import {MenuNavigationProp, MenuStackParamList} from '../typings/navigation';
import useScreenWidth from '../utils/useScreenWidth';

type Props = {
  navigation: MenuNavigationProp<'Menu'>;
};

function MenuHeader() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 240 + Layout.notchHeight,
      }}>
      <CachedImage
        source={require('../assets/hero.png')}
        style={{
          height: 240 + Layout.notchHeight,
          width: Layout.window.width,
          resizeMode: 'cover',
          position: 'absolute',
        }}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
        ]}
      />
      <Image
        source={require('../assets/logo.png')}
        style={[
          {
            width: 220,
            height: 100,
            resizeMode: 'contain',
          },
        ]}
      />
    </View>
  );
}

function MenuScreen(props: Props) {
  const theme: Theme = useTheme();
  const isLargeScreen = useScreenWidth();

  function getIconName(key: keyof MenuStackParamList) {
    if (key === 'Speakers') return 'ios-microphone';
    if (key === 'Crew') return 'ios-information-circle';
    if (key === 'Sponsors') return 'ios-beer';
    if (key === 'Attendees') return 'ios-people';
  }
  const screens: {key: keyof MenuStackParamList}[] = [
    {key: 'Speakers'},
    {key: 'Crew'},
    {key: 'Sponsors'},
    {key: 'Attendees'},
  ];
  return (
    <View style={[{flex: 1}, isLargeScreen && styles.webMenuContainer]}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={screens}
        ListHeaderComponent={isLargeScreen ? <></> : <MenuHeader />}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: '#cdcdcd',
            }}
          />
        )}
        renderItem={({item}) => (
          <LinkButton to={'/' + item.key}>
            <View
              style={[
                isLargeScreen ? {width: 400} : {flex: 1},
                {
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}>
              <Ionicons
                name={getIconName(item.key)}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={{fontSize: 20, marginHorizontal: 16, flex: 1}}>
                {item.key}
              </Text>
              <Ionicons name="ios-arrow-forward" size={24} color="#999" />
            </View>
          </LinkButton>
        )}
      />
    </View>
  );
}

export default MenuScreen;

const styles = StyleSheet.create({
  webMenuContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
});
