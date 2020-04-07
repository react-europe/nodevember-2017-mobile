import React from 'react';
import {
  Platform,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  View,
} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {View as AnimatableView} from 'react-native-animatable';

import {withNavigation} from '../utils/withNavigation';
import MyContacts from '../components/MyContacts';
import {SemiBoldText} from '../components/StyledText';
import {Colors, FontSizes} from '../constants';

class Contacts extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <DeferredContactsContentWithNavigation />
        </ScrollView>
      </View>
    );
  }
}

class DeferredContactsContent extends React.Component {
  state = {
    ready: Platform.OS === 'android' ? false : true,
    tickets: [],
    contacts: [],
  };

  async getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:contacts');
      if (value === null) {
        value = '[]';
      }
      this.setState({contacts: JSON.parse(value)});
    } catch (err) {
      console.log(err);
      this.setState({contacts: []});
    }
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');

      console.log('GETTING tickets', value);
      this.setState({tickets: JSON.parse(value)});
      this.tickets = JSON.parse(value);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.tickets = [];
  }

  componentDidMount() {
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
  componentWillUnmount() {
    this._sub.remove();
  }
  render() {
    if (!this.state.ready) {
      return null;
    }
    console.log('state', this.state);
    const tix = this.state.tickets || [];
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <MyContacts
          contacts={this.state.contacts}
          tickets={this.state.tickets}
          style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
        />
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                {"Scan a contact's QR code"}
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressProfileQRButton}
              underlayColor="#fff">
              <SemiBoldText style={styles.bigButtonText}>
                You need to scan your ticket first
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        )}
      </AnimatableView>
    );
  }

  _handlePressQRButton = () => {
    this.props.navigation.navigate('QRContactScanner');
  };

  _handlePressProfileQRButton = () => {
    this.props.navigation.navigate('QRScanner');
  };
}

const DeferredContactsContentWithNavigation = withNavigation(
  DeferredContactsContent
);

const ClipBorderRadius = ({children, style}) => {
  return (
    <View style={[{borderRadius: BORDER_RADIUS, overflow: 'hidden'}, style]}>
      {children}
    </View>
  );
};

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
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

export default Contacts;
