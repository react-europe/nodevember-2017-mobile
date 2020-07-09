import {Ionicons} from '@expo/vector-icons';
import {Link} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {useTheme, Theme} from 'react-native-paper';

import CachedImage from '../components/CachedImage';
import LinkButton from '../components/LinkButton';
import {SemiBoldText} from '../components/StyledText';
import {Layout} from '../constants';
import {MenuNavigationProp, MenuStackParamList} from '../typings/navigation';

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

  function getIconName(key: keyof MenuStackParamList) {
    if (key === 'Speakers') return 'ios-microphone';
    if (key === 'Crew') return 'ios-information-circle';
    if (key === 'Sponsors') return 'ios-beer';
    if (key === 'Attendees') return 'ios-people';
    if (key === 'Editions')
      return Platform.OS === 'ios' ? 'ios-git-branch' : 'md-git-branch';
  }
  const screens: {key: keyof MenuStackParamList}[] = [
    {key: 'Speakers'},
    {key: 'Crew'},
    {key: 'Sponsors'},
    {key: 'Attendees'},
    {key: 'Editions'},
  ];
  return (
    <View>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={screens}
        ListHeaderComponent={MenuHeader}
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
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
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
      <Link to="/menu/sign-in" style={{alignSelf: 'center'}}>
        <SemiBoldText
          style={{color: theme.colors.primary}}
          fontSize="md"
          TextColorAccent>
          Sign in
        </SemiBoldText>
      </Link>
    </View>
  );
}

export default MenuScreen;
