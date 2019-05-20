import React from 'react';
import {
  Animated,
  Linking,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  View,
} from 'react-native';
import {WebBrowser, Notifications} from 'expo';
import {RectButton} from 'react-native-gesture-handler';
import {NavigationActions} from 'react-navigation';
import {View as AnimatableView} from 'react-native-animatable';
import {Ionicons} from '@expo/vector-icons';
import {withNavigation} from 'react-navigation';

import AnimatedScrollView from '../components/AnimatedScrollView';
import NavigationBar from '../components/NavigationBar';
import TalksUpNext from '../components/TalksUpNext';
import MenuButton from '../components/MenuButton';
import {SemiBoldText} from '../components/StyledText';
import {Colors, FontSizes, Layout} from '../constants';
import {HideWhenConferenceHasEnded, ShowWhenConferenceHasEnded} from '../utils';
import {saveNewContact} from '../utils/storage';

class Home extends React.Component {
  state = {
    scrollY: new Animated.Value(0),
  };
  checkUuidOnLoad(props) {
    console.log(
      'checking props screenprops',
      props.screenProps.initialLinkingUri
    );
    if (props && props.screenProps && props.screenProps.initialLinkingUri) {
      const url = props.screenProps.initialLinkingUri;
      console.log('check url from home', url);
      const uuid = url ? url.split('?uuid=')[1] : '';
      console.log('check uuid from home', uuid);
      if (uuid && uuid !== '') {
        console.log('check uuid from home if', uuid);
        props.navigation.navigate({
          routeName: 'QRScanner',
          key: 'QRScanner',
          params: {uuid: uuid},
        });
      }
    }
  }
  constructor(props) {
    super(props);
    this.checkUuidOnLoad(props);
  }
  componentDidMount() {
    this.checkUuidOnLoad(this.props);
  }
  render() {
    const {scrollY} = this.state;
    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 150],
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
              paddingTop: Layout.headerHeight - 10,
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

          <DeferredHomeContent event={this.props.screenProps.event} />
          <OverscrollView />
        </AnimatedScrollView>

        <NavigationBar animatedBackgroundOpacity={headerOpacity} />
        {this._addLinkingListener()}
      </View>
    );
  }

  _openTickets = () => {
    Linking.openURL(this.state.event.websiteUrl + '#tickets');
  };

  _handleRedirect = url => {
    this.setState({url});
    let {path, queryParams} = Expo.Linking.parse(url);
    console.log(url);
    console.log(path);
    console.log(queryParams);
    const uuid = url && url.url ? url.url.split('?uuid=')[1] : '';
    console.log(
      `Linked to app with path: ${path} and data: ${JSON.stringify(
        queryParams
      )} and uuid is ${uuid}`
    );
    if (uuid && uuid !== '') {
      this.props.navigation.navigate({
        routeName: 'QRScanner',
        key: 'QRScanner',
        params: {uuid: uuid},
      });
    }
  };

  _addLinkingListener = () => {
    Linking.addEventListener('url', this._handleRedirect);
  };
}

@withNavigation
class DeferredHomeContent extends React.Component {
  state = {
    ready: Platform.OS === 'android' ? false : true,
    hasCameraPermission: null,
    Notification: {},
    tickets: [],
    event: this.props.event,
  };

  async getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      // console.log("tickets", value);
      this.setState({tickets: JSON.parse(value)});
      this.tickets = JSON.parse(value);
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  constructor(props) {
    super(props);
    this.getTickets();
  }

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this.getTickets.bind(this)
    );

    if (this.state.ready) {
      return;
    }
    setTimeout(() => {
      this.setState({ready: true});
    }, 200);
  }
  _handleNotification = notification => {
    let navigation = this.props.navigation;
    this.setState({notification: notification});
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
  render() {
    if (!this.state.ready) {
      return null;
    }
    const tix = this.state.tickets || [];
    let isStaff = false;
    tix.map(ticket => {
      if (ticket && (ticket.type === 4 || ticket.canCheckin)) {
        isStaff = true;
      }
    });
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        {isStaff ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressStaffCheckinListsButton}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                Go to checkin
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length === 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                Scan your conference ticket QR code
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length > 0 && !isStaff ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={() => this.props.navigation.navigate('Profile')}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                My tickets
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        <HideWhenConferenceHasEnded>
          <TalksUpNext
            event={this.props.event}
            style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
          />
        </HideWhenConferenceHasEnded>
        <View style={{marginHorizontal: 15, marginBottom: 20}}>
          <TouchableOpacity onPress={this._handlePressAllTalks}>
            <SemiBoldText style={styles.seeAllTalks}>
              <HideWhenConferenceHasEnded>
                See all talks →
              </HideWhenConferenceHasEnded>
              <ShowWhenConferenceHasEnded>
                See all 2018 talks →
              </ShowWhenConferenceHasEnded>
            </SemiBoldText>
          </TouchableOpacity>
        </View>
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={() => this.props.navigation.navigate('Profile')}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                My Tickets
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length === 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                Scan your conference ticket QR code
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
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
            onPress={this._handlePressCOCButton}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              Read the code of conduct
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>

        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressMapButton}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              {Platform.OS === 'android' ? 'Download' : 'Open'} the conference
              map
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>

        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressTwitterButton}
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
              @{this.state.event.twitterHandle}
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      </AnimatableView>
    );
  }

  _handlePressAllTalks = () => {
    this.props.navigation.dispatch(
      NavigationActions.navigate({
        routeName: 'Schedule',
      })
    );
  };

  _handlePressCOCButton = () => {
    WebBrowser.openBrowserAsync(this.state.event.cocUrl);
  };

  _handlePressQRButton = () => {
    this.props.navigation.navigate({
      routeName: 'QRScanner',
      key: 'QRScanner',
    });
  };

  _handlePressStaffCheckinListsButton = () => {
    // console.log("handle press checkinlists");
    this.props.navigation.navigate('StaffCheckinLists');
  };

  _handlePressTwitterButton = async () => {
    try {
      await Linking.openURL(
        `twitter://user?screen_name=` + this.state.event.twitterHandle
      );
    } catch (e) {
      WebBrowser.openBrowserAsync(
        'https://twitter.com/' + this.state.event.twitterHandle
      );
    }
  };

  _handlePressMapButton = () => {
    const params = encodeURIComponent(
      this.state.event.venueName +
        this.state.event.venueCity +
        ',' +
        this.state.event.venueCountry
    );
    WebBrowser.openBrowserAsync('https://www.google.com/maps/search/' + params);
  };
}

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

export default Home;
