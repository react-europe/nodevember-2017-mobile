import React from 'react';
import {AsyncStorage} from 'react-native';
import {query} from 'urql';

import {GQL} from '../../constants';
import {addContact} from '../../utils';
import client from '../../utils/gqlClient';
import QRScreen from './QRScreen';
import {saveNewContact} from '../../utils/storage';
import QR_CONTACT_QUERY from '../../data/qrContactQuery';

export default class QRContactScannerModalNavigation extends React.Component {
  _handleContactBarCodeRead = async data => {
    let navigation = this.props.navigation;
    const value = await AsyncStorage.getItem('@MySuperStore:tickets');
    let tickets = JSON.parse(value) || [];
    let uuid = '';
    let contactRef = data.data;
    tickets.map(async ticket => {
      ticket.checkinLists.map(ch => {
        if (ch.mainEvent) {
          uuid = ticket.uuid;
        }
      });
      let variables = {slug: GQL.slug, uuid: uuid, q: contactRef};

      let scannedContact = await client.query({
        query: QR_CONTACT_QUERY,
        variables: variables,
      });
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
        console.log('new contact query', QR_CONTACT_QUERY);
        console.log('new contact query variables', variables);
        saveNewContact(contact, navigation);
      }
    });
    let variables = {slug: GQL.slug, uuid: uuid, q: contactRef};
    let scannedContact = await client.query({
      query: QR_CONTACT_QUERY,
      variables: variables,
    });
    if (
      scannedContact &&
      scannedContact.data &&
      scannedContact.data.events &&
      scannedContact.data.events[0] &&
      scannedContact.data.events[0].attendees &&
      scannedContact.data.events[0].attendees[0]
    ) {
      let contact = scannedContact.data.events[0].attendees[0];
      await addContact(contact);
      navigation.navigate('Contacts');
    }
  };

  render() {
    return (
      <QRScreen
        title="Scan a badge's QR code"
        onBarCodeScanned={this._handleContactBarCodeRead}
      />
    );
  }
}
