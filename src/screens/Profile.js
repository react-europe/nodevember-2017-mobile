import React from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  View,
  AsyncStorage,
  InteractionManager,
  Alert,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import {RectButton} from 'react-native-gesture-handler';
import {View as AnimatableView} from 'react-native-animatable';

import withNavigation from '../utils/withNavigation';
import Tickets from '../components/Tickets';
import {SemiBoldText} from '../components/StyledText';
import {Colors, FontSizes} from '../constants';

class Profile extends React.Component {
  state = {
    hasCameraPermission: null,
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <DeferredProfileContentWithNavigation />
        </ScrollView>
      </View>
    );
  }
}

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
    InteractionManager.runAfterInteractions(() => {
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

        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressQRButton}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              {tickets.length > 0
                ? 'Scan another ticket QR code'
                : 'Scan your ticket QR code'}
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
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
      this.props.navigation.navigate('QRScanner');
    } else {
      Alert.alert(
        'You need to manually enable camera permissions in your operating system settings app'
      );
    }
  };
}

const DeferredProfileContentWithNavigation = withNavigation(
  DeferredProfileContent
);

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

export default Profile;
