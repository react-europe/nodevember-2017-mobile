import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation, Link} from '@react-navigation/native';
import {Notifications, Linking} from 'expo';
import * as WebBrowser from 'expo-web-browser';
import {Notification} from 'expo/build/Notifications/Notifications.types';
import {EventSubscription} from 'fbemitter';
import moment from 'moment';
import React, {useEffect, useState, useContext} from 'react';
import {
  Animated,
  Platform,
  Image,
  StyleSheet,
  View,
  InteractionManager,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme, Theme, Button} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import AnimatedScrollView from '../components/AnimatedScrollView';
import ChangeEdition from '../components/ChangeEdition';
import LinkButton from '../components/LinkButton';
import NavigationBar from '../components/NavigationBar';
import OverscrollView from '../components/OverscrollView';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import TalksUpNext from '../components/TalksUpNext';
import {Colors, Layout, GQL} from '../constants';
import DataContext from '../context/DataContext';
import {contactState} from '../context/contactState';
import {ticketState} from '../context/ticketState';
import {Attendee} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';
import {
  HideWhenConferenceHasEnded,
  ShowWhenConferenceHasEnded,
  getTickets,
  getContacts,
  displayNextEdition,
} from '../utils';
import {saveNewContact} from '../utils/storage';
import useHeaderHeight from '../utils/useHeaderHeight';
import {checkMediumScreen} from '../utils/useScreenWidth';

type HomeProps = {
  navigation: PrimaryTabNavigationProp<'Home'>;
};

export default function Home(props: HomeProps) {
  const {initialLinkingUri, event} = useContext(DataContext);
  const headerHeight = useHeaderHeight();
  const theme: Theme = useTheme();
  const [scrollY] = useState(new Animated.Value(0));
  const isMediumScreen = checkMediumScreen();

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
          {isMediumScreen && Platform.OS === 'web' && (
            <Button
              style={styles.buttonDrawer}
              onPress={() => props.navigation.openDrawer()}>
              <Ionicons name="md-menu" size={30} style={styles.icon} />
            </Button>
          )}
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
        <View style={Platform.OS === 'web' && {alignItems: 'center'}}>
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
            {event?.name}
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
  const [tickets, setTickets] = useRecoilState(ticketState);
  const [contacts, setContacts] = useRecoilState(contactState);
  const [displayNext, setDisplayNext] = useState(false);
  const [displayDialog, setDisplayDialog] = useState(false);
  let _notificationSubscription: EventSubscription | null = null;
  let lastEdition = null;
  if (event?.otherEditions) {
    lastEdition = event?.otherEditions[event.otherEditions?.length - 1];
  }

  useFocusEffect(
    React.useCallback(() => {
      InteractionManager.runAfterInteractions(async () => {
        if (!tickets && event?.slug) {
          const userTickets = await getTickets(event.slug);
          setTickets(userTickets);
        }
        setReady(true);
      });
    }, [tickets])
  );

  useEffect(() => {
    _notificationSubscription = Notifications.addListener(_handleNotification);
    return function unmount() {
      if (_notificationSubscription) {
        _notificationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    checkDisplayNextEdition();
  }, [event]);

  async function checkDisplayNextEdition() {
    if (!event) return;
    const display = displayNextEdition(event);
    if (display !== displayNext) {
      setDisplayNext(display);
    }
  }

  const _handleNotification = async (notification: Notification) => {
    let userContacts: Attendee[] = [];
    let newContatcts: Attendee[] = [];
    if (notification.data && notification.data.action) {
      switch (notification.data.action) {
        case 'newURL':
          WebBrowser.openBrowserAsync(notification.data.url);
          break;
        case 'newContact':
          if (event?.slug) {
            userContacts = await getContacts(event?.slug);
            newContatcts = await saveNewContact(
              notification.data.data,
              userContacts,
              event.slug
            );
            setContacts(newContatcts);
          }
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
      {displayNext && lastEdition && event?.timezoneId && (
        <View style={{marginHorizontal: 15, marginVertical: 10}}>
          <TouchableOpacity onPress={() => setDisplayDialog(true)}>
            <SemiBoldText
              style={{color: theme.colors.primary}}
              fontSize="md"
              TextColorAccent>
              Next edition is coming on{' '}
              {moment
                .tz(new Date(lastEdition.startDate), event.timezoneId)
                .format('MMM Do, YYYY')}
              , check the new schedule!
            </SemiBoldText>
          </TouchableOpacity>

          <ChangeEdition
            editionSlug={lastEdition ? lastEdition.slug : GQL.slug}
            visible={displayDialog}
            setVisible={setDisplayDialog}
          />
        </View>
      )}
      {isStaff ? (
        <LinkButton to="/StaffCheckinLists">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Go to checkin
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {!tickets || tickets.length <= 0 ? (
        <LinkButton to="/QRScanner">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Scan your conference ticket QR code
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {tickets && tickets.length > 0 && !isStaff ? (
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
            {event?.timezoneId && (
              <ShowWhenConferenceHasEnded>
                See all{' '}
                {moment
                  .tz(new Date(event.startDate), event.timezoneId)
                  .format('YYYY')}{' '}
                talks →
              </ShowWhenConferenceHasEnded>
            )}
          </SemiBoldText>
        </Link>
      </View>
      {tickets && tickets.length > 0 ? (
        <LinkButton to="/profile">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              My tickets
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {!tickets || tickets.length <= 0 ? (
        <LinkButton to="/QRScanner">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Scan your conference ticket QR code
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      {tickets && tickets.length > 0 ? (
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
  icon: {
    color: '#FFF',
  },
  buttonDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
