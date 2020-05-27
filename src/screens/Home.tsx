import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation, Link} from '@react-navigation/native';
import {Notifications, Linking} from 'expo';
import * as WebBrowser from 'expo-web-browser';
import {Notification} from 'expo/build/Notifications/Notifications.types';
import {EventSubscription} from 'fbemitter';
import React, {useEffect, useState, useContext} from 'react';
import {
  Animated,
  Platform,
  Image,
  StyleSheet,
  AsyncStorage,
  View,
  InteractionManager,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {useTheme, Theme} from 'react-native-paper';

import AnimatedScrollView from '../components/AnimatedScrollView';
import LinkButton from '../components/LinkButton';
import NavigationBar from '../components/NavigationBar';
import OverscrollView from '../components/OverscrollView';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import TalksUpNext from '../components/TalksUpNext';
import {Colors, Layout} from '../constants';
import DataContext from '../context/DataContext';
import {User} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';
import {HideWhenConferenceHasEnded, ShowWhenConferenceHasEnded} from '../utils';
import {saveNewContact} from '../utils/storage';
import useHeaderHeight from '../utils/useHeaderHeight';
import useScreenWidth from '../utils/useScreenWidth';

type HomeProps = {
  navigation: PrimaryTabNavigationProp<'Home'>;
};

export default function Home(props: HomeProps) {
  const {initialLinkingUri} = useContext(DataContext);
  const headerHeight = useHeaderHeight();
  const theme: Theme = useTheme();
  const [scrollY] = useState(new Animated.Value(0));
  const isLargeScreen = useScreenWidth();

  function checkUuidOnLoad() {
    console.log('checking props initialLinkingUri', initialLinkingUri);
    if (initialLinkingUri) {
      const url = initialLinkingUri;
      console.log('check url from home', url);
      const uuid = url ? url.split('?uuid=')[1] : '';
      console.log('check uuid from home', uuid);
      if (uuid && uuid !== '') {
        console.log('check uuid from home if', uuid);
        props.navigation.navigate('QRScanner', {uuid});
      }
    }
  }

  useEffect(() => {
    checkUuidOnLoad();
    _addLinkingListener();
    return function unmount() {
      Linking.removeEventListener('url', _handleRedirect);
    };
  }, []);

  const _handleRedirect = (url: {url: string}) => {
    const {path, queryParams} = Linking.parse(url.url);
    const uuid = url && url.url ? url.url.split('?uuid=')[1] : '';
    console.log(
      `Linked to app with path: ${path} and data: ${JSON.stringify(
        queryParams
      )} and uuid is ${uuid}`
    );
    if (uuid && uuid !== '') {
      props.navigation.navigate('QRScanner', {uuid});
    }
  };

  const _addLinkingListener = () => {
    Linking.addEventListener('url', _handleRedirect);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerLogoOpacity = scrollY.interpolate({
    inputRange: [100, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={{flex: 1}}>
      <AnimatedScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 20 + Layout.notchHeight / 2}}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: true}
        )}>
        <View
          style={{
            backgroundColor: theme.colors.primary,
            padding: 10,
            paddingTop: headerHeight - 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/logo.png')}
            style={{width: 220, height: 60, resizeMode: 'contain'}}
          />
          <View style={styles.headerContent}>
            <ShowWhenConferenceHasEnded>
              <SemiBoldText
                style={styles.headerText}
                fontSize="lg"
                TextColorAccent>
                Thank you for joining us!
              </SemiBoldText>
              <SemiBoldText fontSize="sm" TextColorAccent>
                See you in May, 2020!
              </SemiBoldText>
            </ShowWhenConferenceHasEnded>

            <HideWhenConferenceHasEnded>
              <SemiBoldText
                style={styles.headerText}
                fontSize="lg"
                TextColorAccent>
                May 23rd to 24th (Conference)
              </SemiBoldText>
              <SemiBoldText
                style={styles.headerText}
                fontSize="lg"
                TextColorAccent>
                May 21st to 22nd (Workshops)
              </SemiBoldText>
              <SemiBoldText
                style={styles.headerText}
                fontSize="lg"
                TextColorAccent>
                Paris, France
              </SemiBoldText>
            </HideWhenConferenceHasEnded>
          </View>
        </View>
        <View style={isLargeScreen && {alignItems: 'center'}}>
          <DeferredHomeContent />
        </View>
        <OverscrollView />
      </AnimatedScrollView>

      <NavigationBar
        animatedBackgroundOpacity={headerOpacity}
        renderTitle={() => (
          <Animated.Text
            style={{
              fontSize: 17,
              marginTop: -2,
              fontFamily: 'open-sans-bold',
              opacity: headerLogoOpacity,
              color: '#fff',
            }}>
            React Europe 2019
          </Animated.Text>
        )}
      />
    </View>
  );
}

function DeferredHomeContent() {
  const {event} = useContext(DataContext);
  const theme: Theme = useTheme();
  const navigation = useNavigation<PrimaryTabNavigationProp<'Home'>>();
  const [ready, setReady] = useState(Platform.OS !== 'android');
  const [tickets, setTickets] = useState<User[]>([]);
  let _notificationSubscription: EventSubscription | null = null;

  async function getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      if (value) {
        setTickets(JSON.parse(value));
      }
    } catch (err) {
      console.log(err);
    }
    setReady(true);
  }

  useFocusEffect(
    React.useCallback(() => {
      InteractionManager.runAfterInteractions(() => {
        getTickets();
      });
    }, [])
  );

  useEffect(() => {
    _notificationSubscription = Notifications.addListener(_handleNotification);
    return function unmount() {
      if (_notificationSubscription) {
        _notificationSubscription.remove();
      }
    };
  }, []);

  const _handleNotification = (notification: Notification) => {
    if (notification.data && notification.data.action) {
      switch (notification.data.action) {
        case 'newURL':
          WebBrowser.openBrowserAsync(notification.data.url);
          break;
        case 'newContact':
          console.log(notification);
          saveNewContact(notification.data.data);
          navigation.navigate('Contacts');
          break;
        default:
          console.log('ok');
      }
    }
  };

  const _handlePressCOCButton = () => {
    if (event?.cocUrl) {
      WebBrowser.openBrowserAsync(event.cocUrl);
    }
  };

  const _handlePressTwitterButton = async () => {
    if (event) {
      if (Platform.OS === 'web') {
        WebBrowser.openBrowserAsync(
          'https://twitter.com/' + event.twitterHandle
        );
      } else {
        try {
          await Linking.openURL(
            `twitter://user?screen_name=` + event.twitterHandle
          );
        } catch (e) {
          WebBrowser.openBrowserAsync(
            'https://twitter.com/' + event.twitterHandle
          );
        }
      }
    }
  };

  const _handlePressMapButton = () => {
    if (event?.venueName && event.venueCity) {
      const params = encodeURIComponent(
        event.venueName + event.venueCity + ',' + event.venueCountry
      );
      WebBrowser.openBrowserAsync(
        'https://www.google.com/maps/search/' + params
      );
    }
  };

  if (!ready) {
    return null;
  }
  let isStaff = false;
  if (tickets) {
    tickets.map((ticket) => {
      if (ticket && (ticket.type === 4 || ticket.canCheckin)) {
        isStaff = true;
      }
    });
  }
  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      {isStaff ? (
        <LinkButton to="/StaffCheckinLists">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Go to checkin
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {tickets.length <= 0 ? (
        <LinkButton to="/QRScanner">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Scan your conference ticket QR code
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {tickets.length > 0 && !isStaff ? (
        <LinkButton to="/profile">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              My tickets
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {event && (
        <HideWhenConferenceHasEnded>
          <TalksUpNext
            event={event}
            style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
          />
        </HideWhenConferenceHasEnded>
      )}
      <View style={{marginHorizontal: 15, marginBottom: 20}}>
        <Link to="/schedule">
          <SemiBoldText
            style={{color: theme.colors.primary}}
            fontSize="md"
            TextColorAccent>
            <HideWhenConferenceHasEnded>
              See all talks →
            </HideWhenConferenceHasEnded>
            <ShowWhenConferenceHasEnded>
              See all 2019 talks →
            </ShowWhenConferenceHasEnded>
          </SemiBoldText>
        </Link>
      </View>
      {tickets.length > 0 ? (
        <LinkButton to="/profile">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              My tickets
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {tickets.length <= 0 ? (
        <LinkButton to="/QRScanner">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Scan your conference ticket QR code
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {tickets.length > 0 ? (
        <LinkButton to="/QRScanner">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Scan another ticket QR code
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {event?.cocUrl && (
        <PrimaryButton onPress={_handlePressCOCButton}>
          <SemiBoldText fontSize="md" TextColorAccent>
            Read the code of conduct
          </SemiBoldText>
        </PrimaryButton>
      )}

      {event?.venueName && event.venueCity && (
        <PrimaryButton onPress={_handlePressMapButton}>
          <SemiBoldText fontSize="md" TextColorAccent>
            {Platform.OS === 'android' ? 'Download' : 'Open'} the conference map
          </SemiBoldText>
        </PrimaryButton>
      )}

      {event?.twitterHandle && (
        <PrimaryButton onPress={_handlePressTwitterButton}>
          <SemiBoldText fontSize="md" TextColorAccent>
            <Ionicons
              name="logo-twitter"
              size={23}
              style={{
                color: '#fff',
                backgroundColor: 'transparent',
              }}
            />
            @{event.twitterHandle}
          </SemiBoldText>
        </PrimaryButton>
      )}
    </AnimatableView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 10,
  },
  headerText: {
    lineHeight: 17 * 1.5,
  },
  seeAllTalks: {
    color: Colors.blue,
  },
});
