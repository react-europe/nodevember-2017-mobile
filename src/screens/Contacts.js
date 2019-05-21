import React from 'react';
import {Platform, ScrollView, AsyncStorage, View} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {withNavigation} from 'react-navigation';
import MyContacts from '../components/MyContacts';
import BigButton from '../components/BigButton';

function Contacts() {
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <DeferredContactsContent />
      </ScrollView>
    </View>
  );
}

@withNavigation
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
          <BigButton onPress={this._handlePressQRButton}>
            Scan a contact's QR code
          </BigButton>
        ) : (
          <BigButton onPress={this._handlePressProfileQRButton}>
            You need to scan your ticket first
          </BigButton>
        )}
      </AnimatableView>
    );
  }

  _handlePressQRButton = () => {
    this.props.navigation.navigate({
      routeName: 'QRContactScanner',
      key: 'QRContactScanner',
    });
  };

  _handlePressProfileQRButton = () => {
    this.props.navigation.navigate({
      routeName: 'QRScanner',
      key: 'QRScanner',
    });
  };
}

export default Contacts;
