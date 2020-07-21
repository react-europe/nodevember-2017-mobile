import {Ionicons} from '@expo/vector-icons';
import {Link, useFocusEffect} from '@react-navigation/native';
import React, {useContext, useCallback} from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme, Theme} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import CachedImage from '../components/CachedImage';
import LinkButton from '../components/LinkButton';
import {SemiBoldText} from '../components/StyledText';
import {Layout} from '../constants';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {MenuStackParamList} from '../typings/navigation';
import {removeValueInStore, getValueFromStore} from '../utils';

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

function MenuScreen() {
  const theme: Theme = useTheme();
  const {event} = useContext(DataContext);
  const [adminToken, setAdminToken] = useRecoilState(adminTokenState);

  function getIconName(key: keyof MenuStackParamList) {
    if (key === 'Speakers') return 'ios-microphone';
    if (key === 'Crew') return 'ios-information-circle';
    if (key === 'Sponsors') return 'ios-beer';
    if (key === 'Attendees') return 'ios-people';
    if (key === 'EditEvent') return 'ios-cog';
    if (key === 'Editions')
      return Platform.OS === 'ios' ? 'ios-git-branch' : 'md-git-branch';
  }
  let screens: {key: keyof MenuStackParamList}[] = [
    {key: 'Speakers'},
    {key: 'Crew'},
    {key: 'Sponsors'},
    {key: 'Attendees'},
    {key: 'Editions'},
  ];

  if (adminToken?.token) {
    screens = [...screens, {key: 'EditEvent'}];
  }

  async function updateAdminToken() {
    if (
      !event?.slug ||
      (adminToken?.edition && adminToken.edition === event.slug)
    ) {
      return;
    }
    const token: string = await getValueFromStore('adminToken', event.slug);
    setAdminToken({token, edition: event.slug});
  }

  useFocusEffect(
    useCallback(() => {
      updateAdminToken();
    }, [adminToken, event])
  );

  async function logout() {
    if (!event?.slug) return;
    await removeValueInStore('adminToken', event?.slug);
    setAdminToken({token: null, edition: event.slug});
  }

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
      <View style={{alignItems: 'center'}}>
        {adminToken?.token ? (
          <TouchableOpacity onPress={logout}>
            <SemiBoldText
              style={{color: theme.colors.primary}}
              fontSize="md"
              TextColorAccent>
              Log out
            </SemiBoldText>
          </TouchableOpacity>
        ) : (
          <Link to="/menu/sign-in">
            <SemiBoldText
              style={{color: theme.colors.primary}}
              fontSize="md"
              TextColorAccent>
              Sign in
            </SemiBoldText>
          </Link>
        )}
      </View>
    </View>
  );
}

export default MenuScreen;
