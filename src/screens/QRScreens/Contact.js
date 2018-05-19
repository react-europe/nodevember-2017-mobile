import React from 'react';
import { AsyncStorage } from 'react-native';
import { query } from 'urql';

import { GQL } from '../../constants';
import { addContact } from '../../utils';
import client from '../../utils/gqlClient';
import QRScreen from './QRScreen';

const qrContactQuery = `
query events($slug: String!, $uuid: String!, $q: String!){
  events(slug: $slug) {
    attendees(uuid: $uuid, q: $q){
      lastName
      firstName
      id
      email
      answers {
        id
        question{
          id
          title
        }
        value
      }
    }
  }
}
`;

export default class QRContactScannerModalNavigation extends React.Component {
  _handleContactBarCodeRead = async data => {
    let navigation = this.props.navigation;
    const value = await AsyncStorage.getItem('@MySuperStore:tickets');
    let tickets = JSON.parse(value) || [];
    let uuid = '';
    let contactRef = data.data;
    tickets.map(ticket => {
      ticket.checkinLists.map(ch => {
        if (ch.mainEvent) {
          uuid = ticket.uuid;
        }
      });
    });
    let variables = { slug: GQL.slug, uuid: uuid, q: contactRef };
    const scannedContact = await client.executeQuery(query(qrContactQuery, variables), true);
    if (
      scannedContact &&
      scannedContact.data &&
      scannedContact.data.events &&
      scannedContact.data.events[0] &&
      scannedContact.data.events[0].attendees &&
      scannedContact.data.events[0].attendees[0]
    ) {
      let contact = scannedContact.data.events[0].attendees[0];
      console.log('new contact', contact);
      await addContact(contact);
      navigation.navigate('Contacts');
    }
  };

  render() {
    return (
      <QRScreen
        title="Scan a badge's QR code"
        onBarCodeRead={this._handleContactBarCodeRead}
      />
    );
  }
}
