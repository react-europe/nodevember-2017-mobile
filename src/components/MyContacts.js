import React from 'react';
import {Alert, Clipboard, View, AsyncStorage, StyleSheet} from 'react-native';
import {BorderlessButton, RectButton} from 'react-native-gesture-handler';
import {sendEmail, openTwitter, getContactTwitter} from '../utils';
import {Title} from 'react-native-paper';

import {SemiBoldText} from './StyledText';
import ContactCard from './ContactCard';
import {FontSizes, Colors} from '../constants';
import BigButton from './BigButton';

export default class MyContacts extends React.Component {
  state = {
    contacts: [],
  };
  async getContacts() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:contacts');
      this.setState({contacts: JSON.parse(value)});
    } catch (err) {
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.contacts = this.props.contacts;
    this.tickets = this.props.tickets;
    // console.log("tickets from MyContacts", this.tickets);
  }
  componentDidMount() {
    this.getContacts();
  }
  render() {
    const contacts = this.props.contacts;
    return (
      <View style={[{marginHorizontal: 10}, this.props.style]}>
          <Title>My Contacts</Title>
        {contacts && contacts.length > 0 ? (
          <BigButton onPress={this._handlePressCopyEmails}>Copy all emails to clipboard</BigButton>
        ) : null}
        {this.props.contacts.map(contact => (
          <ContactCard
            key={contact.id + contact.email}
            contact={contact}
            tickets={this.props.tickets}
            style={{marginTop: 10, marginBottom: 10}}
          />
        ))}
      </View>
    );
  }

  _handlePressCopyEmails = () => {
    let contacts = 'first name,last name,email,twitter\n';
    this.props.contacts.map(contact => {
      contacts +=
        contact.firstName +
        ',' +
        contact.lastName +
        ',' +
        contact.email +
        ',' +
        getContactTwitter(contact) +
        ' \n';
    });
    Clipboard.setString(contacts);
    Alert.alert(
      'Contacts copied',
      'Your contacts have been copied in csv format, you can past them anywhere',
      [{text: 'OK', onPress: () => Clipboard.setString(contacts)}]
    );
  };
}
