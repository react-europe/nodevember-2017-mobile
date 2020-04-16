import React, {useEffect, useState} from 'react';
import {
  Animated,
  Linking,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  View,
  InteractionManager,
} from 'react-native';
import {Notifications} from 'expo';
import * as WebBrowser from 'expo-web-browser';
import {RectButton} from 'react-native-gesture-handler';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {View as AnimatableView} from 'react-native-animatable';
import {Ionicons} from '@expo/vector-icons';

import {withNavigation} from '../utils/withNavigation';
import AnimatedScrollView from '../components/AnimatedScrollView';
import NavigationBar from '../components/NavigationBar';
import TalksUpNext from '../components/TalksUpNext';
import {SemiBoldText} from '../components/StyledText';
import {Colors, FontSizes, Layout} from '../constants';
import {HideWhenConferenceHasEnded, ShowWhenConferenceHasEnded} from '../utils';
import {saveNewContact} from '../utils/storage';
import {withData} from '../context/DataContext';
import withHeaderHeight from '../utils/withHeaderHeight';

function Home(props) {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));

  function checkUuidOnLoad() {
    console.log('checking props initialLinkingUri', props.initialLinkingUri);
    if (props.initialLinkingUri) {
      const url = props.initialLinkingUri;
      console.log('check url from home', url);
      const uuid = url ? url.split('?uuid=')[1] : '';
      console.log('check uuid from home', uuid);
      if (uuid && uuid !== '') {
        console.log('check uuid from home if', uuid);
        props.navigation.navigate('QRScanner', {uuid: uuid});
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

  const _handleRedirect = url => {
    let {path, queryParams} = Linking.parse(url);
    const uuid = url && url.url ? url.url.split('?uuid=')[1] : '';
    console.log(
      `Linked to app with path: ${path} and data: ${JSON.stringify(
        queryParams
      )} and uuid is ${uuid}`
    );
    if (uuid && uuid !== '') {
      props.navigation.navigate('QRScanner', {uuid: uuid});
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
            backgroundColor: Colors.blue,
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
              <SemiBoldText style={styles.headerText}>
                Thank you for joining us!
              </SemiBoldText>
              <SemiBoldText style={[styles.headerTextSmall, {color: '#fff'}]}>
                See you in May, 2020!
              </SemiBoldText>
            </ShowWhenConferenceHasEnded>

            <HideWhenConferenceHasEnded>
              <SemiBoldText style={styles.headerText}>
                May 23rd to 24th (Conference)
              </SemiBoldText>
              <SemiBoldText style={styles.headerText}>
                May 21st to 22nd (Workshops)
              </SemiBoldText>
              <SemiBoldText style={styles.headerText}>
                Paris, France
              </SemiBoldText>
            </HideWhenConferenceHasEnded>
          </View>
        </View>
        <DeferredHomeContentWithNavigation event={props.event} />
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

function DeferredHomeContent(props) {
  const [ready, setReady] = useState(Platform.OS === 'android' ? false : true);
  const [tickets, setTickets] = useState([]);
  let _notificationSubscription = undefined;

  async function getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      setTickets(JSON.parse(value));
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

  const _handleNotification = notification => {
    let navigation = props.navigation;
    if (notification && notification.data && notification.data.action) {
      switch (notification.data.action) {
        case 'newURL':
          WebBrowser.openBrowserAsync(notification.data.url);
          break;
        case 'newContact':
          console.log(notification);
          let contact = notification.data.data;
          saveNewContact(contact, navigation);
          break;
        default:
          console.log('ok');
      }
    }
  };

  const _handlePressAllTalks = () => {
    props.navigation.dispatch(
      CommonActions.navigate({
        name: 'Schedule',
      })
    );
  };

  const _handlePressCOCButton = () => {
    WebBrowser.openBrowserAsync(props.event.cocUrl);
  };

  const _handlePressQRButton = () => {
    props.navigation.navigate('QRScanner');
  };

  const _handlePressStaffCheckinListsButton = () => {
    // console.log("handle press checkinlists");
    props.navigation.navigate('StaffCheckinLists');
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
    const params = encodeURIComponent(
      props.event.venueName +
        props.event.venueCity +
        ',' +
        props.event.venueCountry
    );
    WebBrowser.openBrowserAsync('https://www.google.com/maps/search/' + params);
  };

  if (!ready) {
    return null;
  }
  let isStaff = false;
  if (tickets) {
    tickets.map(ticket => {
      if (ticket && (ticket.type === 4 || ticket.canCheckin)) {
        isStaff = true;
      }
    });
  }
  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      {isStaff ? (
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={_handlePressStaffCheckinListsButton}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              Go to checkin
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      ) : null}
      {!tickets ? (
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={_handlePressQRButton}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              Scan your conference ticket QR code
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      ) : null}
      {tickets && tickets.length > 0 && !isStaff ? (
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={() => props.navigation.navigate('Profile')}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>My tickets</SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      ) : null}
      <HideWhenConferenceHasEnded>
        <TalksUpNext
          event={props.event}
          style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
        />
      </HideWhenConferenceHasEnded>
      <View style={{marginHorizontal: 15, marginBottom: 20}}>
        <TouchableOpacity onPress={_handlePressAllTalks}>
          <SemiBoldText style={styles.seeAllTalks}>
            <HideWhenConferenceHasEnded>
              See all talks →
            </HideWhenConferenceHasEnded>
            <ShowWhenConferenceHasEnded>
              See all 2019 talks →
            </ShowWhenConferenceHasEnded>
          </SemiBoldText>
        </TouchableOpacity>
      </View>
      {tickets && tickets.length > 0 ? (
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={() => props.navigation.navigate('Profile')}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>My Tickets</SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      ) : null}
      {!tickets ? (
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={_handlePressQRButton}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              Scan your conference ticket QR code
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      ) : null}
      {tickets && tickets.length > 0 ? (
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={_handlePressQRButton}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              Scan another ticket QR code
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      ) : null}
      <ClipBorderRadius>
        <RectButton
          style={styles.bigButton}
          onPress={_handlePressCOCButton}
          underlayColor="#fff">
          <SemiBoldText style={styles.bigButtonText}>
            Read the code of conduct
          </SemiBoldText>
        </RectButton>
      </ClipBorderRadius>

      <ClipBorderRadius>
        <RectButton
          style={styles.bigButton}
          onPress={_handlePressMapButton}
          underlayColor="#fff">
          <SemiBoldText style={styles.bigButtonText}>
            {Platform.OS === 'android' ? 'Download' : 'Open'} the conference map
          </SemiBoldText>
        </RectButton>
      </ClipBorderRadius>

      <ClipBorderRadius>
        <RectButton
          style={styles.bigButton}
          onPress={_handlePressTwitterButton}
          underlayColor="#fff">
          <Ionicons
            name="logo-twitter"
            size={23}
            style={{
              color: '#fff',
              marginTop: 3,
              backgroundColor: 'transparent',
              marginRight: 5,
            }}
          />
          <SemiBoldText style={styles.bigButtonText}>
            @{props.event.twitterHandle}
          </SemiBoldText>
        </RectButton>
      </ClipBorderRadius>
    </AnimatableView>
  );
}

const DeferredHomeContentWithNavigation = withNavigation(DeferredHomeContent);

const OverscrollView = () => (
  <View
    style={{
      position: 'absolute',
      top: -400,
      height: 400,
      left: 0,
      right: 0,
      backgroundColor: Colors.blue,
    }}
  />
);

const ClipBorderRadius = ({children, style}) => {
  return (
    <View
      style={[
        {borderRadius: BORDER_RADIUS, overflow: 'hidden', marginTop: 10},
        style,
      ]}>
      {children}
    </View>
  );
};

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
  headerContent: {
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 10,
  },
  headerVideoLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  headerVideoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.blue,
    opacity: 0.8,
  },
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 17 * 1.5,
  },
  headerSmallText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 7,
    lineHeight: 7 * 1.5,
  },
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
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center',
  },
  seeAllTalks: {
    fontSize: FontSizes.normalButton,
    color: Colors.blue,
  },
});

export default withHeaderHeight(withData(Home));
