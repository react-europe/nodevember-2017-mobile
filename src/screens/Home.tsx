import {Ionicons} from '@expo/vector-icons';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {Notifications, Linking} from 'expo';
import * as WebBrowser from 'expo-web-browser';
import {Notification} from 'expo/build/Notifications/Notifications.types';
import {EventSubscription} from 'fbemitter';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  View,
  InteractionManager,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {useTheme, Theme} from 'react-native-paper';

import AnimatedScrollView from '../components/AnimatedScrollView';
import NavigationBar from '../components/NavigationBar';
import OverscrollView from '../components/OverscrollView';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import TalksUpNext from '../components/TalksUpNext';
import {Colors, Layout} from '../constants';
import {withData} from '../context/DataContext';
import {Event, User} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';
import {HideWhenConferenceHasEnded, ShowWhenConferenceHasEnded} from '../utils';
import {saveNewContact} from '../utils/storage';
import withHeaderHeight from '../utils/withHeaderHeight';

type HomeProps = {
  navigation: PrimaryTabNavigationProp<'Home'>;
  event: Event;
  initialLinkingUri: string;
  headerHeight: number;
};

type DeferredHomeContentProps = {
  event: Event;
};

function Home(props: HomeProps) {
  const theme: Theme = useTheme();
  const [scrollY] = useState(new Animated.Value(0));

  function checkUuidOnLoad() {
    console.log('checking props initialLinkingUri', props.initialLinkingUri);
    if (props.initialLinkingUri) {
      const url = props.initialLinkingUri;
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
            paddingTop: props.headerHeight - 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/logo.png')}
            style={{width: 220, height: 60, resizeMode: 'contain'}}
          />
          <View style={styles.headerContent}>
            <ShowWhenConferenceHasEnded>
              <SemiBoldText style={styles.headerText} fontSize="lg" accent>
                Thank you for joining us!
              </SemiBoldText>
              <SemiBoldText fontSize="sm" accent>
                See you in May, 2020!
              </SemiBoldText>
            </ShowWhenConferenceHasEnded>

            <HideWhenConferenceHasEnded>
              <SemiBoldText style={styles.headerText} fontSize="lg" accent>
                May 23rd to 24th (Conference)
              </SemiBoldText>
              <SemiBoldText style={styles.headerText} fontSize="lg" accent>
                May 21st to 22nd (Workshops)
              </SemiBoldText>
              <SemiBoldText style={styles.headerText} fontSize="lg" accent>
                Paris, France
              </SemiBoldText>
            </HideWhenConferenceHasEnded>
          </View>
        </View>
        <DeferredHomeContent event={props.event} />
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

function DeferredHomeContent(props: DeferredHomeContentProps) {
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

  const _handlePressAllTalks = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Schedule',
      })
    );
  };

  const _handlePressCOCButton = () => {
    if (props.event.cocUrl) {
      WebBrowser.openBrowserAsync(props.event.cocUrl);
    }
  };

  const _handlePressQRButton = () => {
    navigation.navigate('QRScanner');
  };

  const _handlePressStaffCheckinListsButton = () => {
    // console.log("handle press checkinlists");
    navigation.navigate('StaffCheckinLists');
  };

  const _handlePressTwitterButton = async () => {
    try {
      await Linking.openURL(
        `twitter://user?screen_name=` + props.event.twitterHandle
      );
    } catch (e) {
      WebBrowser.openBrowserAsync(
        'https://twitter.com/' + props.event.twitterHandle
      );
    }
  };

  const _handlePressMapButton = () => {
    if (props.event.venueName && props.event.venueCity) {
      const params = encodeURIComponent(
        props.event.venueName +
          props.event.venueCity +
          ',' +
          props.event.venueCountry
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
        <PrimaryButton onPress={_handlePressStaffCheckinListsButton}>
          <SemiBoldText fontSize="md" accent>
            Go to checkin
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      {tickets.length <= 0 ? (
        <PrimaryButton onPress={_handlePressQRButton}>
          <SemiBoldText fontSize="md" accent>
            Scan your conference ticket QR code
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      {tickets.length > 0 && !isStaff ? (
        <PrimaryButton onPress={() => navigation.navigate('Profile')}>
          <SemiBoldText fontSize="md" accent>
            My tickets
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      <HideWhenConferenceHasEnded>
        <TalksUpNext
          event={props.event}
          style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
        />
      </HideWhenConferenceHasEnded>
      <View style={{marginHorizontal: 15, marginBottom: 20}}>
        <TouchableOpacity onPress={_handlePressAllTalks}>
          <SemiBoldText
            style={{color: theme.colors.primary}}
            fontSize="md"
            accent>
            <HideWhenConferenceHasEnded>
              See all talks →
            </HideWhenConferenceHasEnded>
            <ShowWhenConferenceHasEnded>
              See all 2019 talks →
            </ShowWhenConferenceHasEnded>
          </SemiBoldText>
        </TouchableOpacity>
      </View>
      {tickets.length > 0 ? (
        <PrimaryButton onPress={() => navigation.navigate('Profile')}>
          <SemiBoldText fontSize="md" accent>
            My tickets
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      {tickets.length <= 0 ? (
        <PrimaryButton onPress={_handlePressQRButton}>
          <SemiBoldText fontSize="md" accent>
            Scan your conference ticket QR code
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      {tickets.length > 0 ? (
        <PrimaryButton onPress={_handlePressQRButton}>
          <SemiBoldText fontSize="md" accent>
            Scan another ticket QR code
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      {props.event.cocUrl && (
        <PrimaryButton onPress={_handlePressCOCButton}>
          <SemiBoldText fontSize="md" accent>
            Read the code of conduct
          </SemiBoldText>
        </PrimaryButton>
      )}

      {props.event.venueName && props.event.venueCity && (
        <PrimaryButton onPress={_handlePressMapButton}>
          <SemiBoldText fontSize="md" accent>
            {Platform.OS === 'android' ? 'Download' : 'Open'} the conference map
          </SemiBoldText>
        </PrimaryButton>
      )}

      <PrimaryButton onPress={_handlePressTwitterButton}>
        <SemiBoldText fontSize="md" accent>
          <Ionicons
            name="logo-twitter"
            size={23}
            style={{
              color: '#fff',
              backgroundColor: 'transparent',
            }}
          />
          @{props.event.twitterHandle}
        </SemiBoldText>
      </PrimaryButton>
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

export default withHeaderHeight(withData(Home));
