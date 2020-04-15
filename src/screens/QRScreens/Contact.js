import React from 'react';
import {AsyncStorage} from 'react-native';

import {GQL} from '../../constants';
import {addContact} from '../../utils';
import client from '../../utils/gqlClient';
import QRScreen from './QRScreen';
import {saveNewContact} from '../../utils/storage';
import QR_CONTACT_QUERY from '../../data/qrContactQuery';

export default function QRContactScannerModalNavigation(props) {
  const _handleContactBarCodeRead = async data => {
    const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
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
      if (scannedContact?.data?.events[0]?.attendees[0]) {
        let contact = scannedContact.data.events[0].attendees[0];
        console.log('new contact', contact);
        console.log('new contact query', QR_CONTACT_QUERY);
        console.log('new contact query variables', variables);
        saveNewContact(contact, props.navigation);
      }
    });
    let variables = {slug: GQL.slug, uuid: uuid, q: contactRef};
    let scannedContact = await client.query({
      query: QR_CONTACT_QUERY,
      variables: variables,
    });
    if (scannedContact?.data?.events[0]?.attendees[0]) {
      let contact = scannedContact.data.events[0].attendees[0];
      await addContact(contact);
      props.navigation.navigate('Contacts');
    }
  };

  return (
    <QRScreen
      title="Scan a badge's QR code"
      onBarCodeScanned={_handleContactBarCodeRead}
    />
  );
}
