import React from 'react';
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  ScrollView,
  View,
  AsyncStorage,
} from 'react-native';
import {Permissions} from 'expo';
import {RectButton} from 'react-native-gesture-handler';
import {View as AnimatableView} from 'react-native-animatable';
import {withNavigation} from 'react-navigation';

import NavigationBar from '../components/NavigationBar';
import Tickets from '../components/Tickets';
import MenuButton from '../components/MenuButton';
import {SemiBoldText} from '../components/StyledText';
import {Colors, FontSizes, Layout} from '../constants';
import BigButton from '../components/BigButton';

class Profile extends React.Component {
  state = {
    hasCameraPermission: null,
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <DeferredProfileContent />
        </ScrollView>
      </View>
    );
  }
}

@withNavigation
class DeferredProfileContent extends React.Component {
  state = {
    tickets: [],
    ready: Platform.OS === 'android' ? false : true,
  };

  getTickets = async () => {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      const tickets = JSON.parse(value);
      this.setState({tickets});
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  constructor(props) {
    super(props);
    props.navigation.addListener('didFocus', () => {
      this.getTickets();
    });
    this.getTickets();
  }

  componentDidMount() {
    if (this.state.ready) {
      return;
    }

    setTimeout(() => {
      this.setState({ready: true});
    }, 200);
  }

  render() {
    let tickets = this.state.tickets || [];
    if (!this.state.ready) {
      return null;
    }
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <Tickets
          tickets={this.state.tickets}
          style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
        />
        <BigButton onPress={this._handlePressQRButton}>
        {tickets.length > 0
                ? 'Scan another ticket QR code'
                : 'Scan your ticket QR code'}
        </BigButton>
      </AnimatableView>
    );
  }
  _requestCameraPermission = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    let hasCameraPermission = status === 'granted';
    this.setState({hasCameraPermission});
    return hasCameraPermission;
  };

  _handlePressQRButton = async () => {
    if (await this._requestCameraPermission()) {
      this.props.navigation.navigate({
        routeName: 'QRScanner',
        key: 'QRScanner',
      });
    } else {
      alert(
        'You need to manually enable camera permissions in your operating system settings app'
      );
    }
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
    }}
  />
);

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
  seeAllTalks: {
    fontSize: FontSizes.normalButton,
    color: Colors.blue,
  },
});

export default Profile;
