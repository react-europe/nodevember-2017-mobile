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
      let variables = { slug: GQL.slug, uuid: uuid, q: contactRef };
      client
        .executeQuery(query(qrContactQuery, variables), true)
        .then(function(scannedContact) {
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
            AsyncStorage.getItem('@MySuperStore:contacts').then(
              storedContacts => {
                let contacts = null;
                let newContacts = [];
                let found = false;
                if (storedContacts === null && contact && contact.firstName) {
                  contacts = [contact];
                } else {
                  let existingContacts = JSON.parse(storedContacts) || [];
                  console.log(
                    'how many existing contacts',
                    existingContacts.length
                  );
                  existingContacts.map((existingContact) => {
                    console.log('existing contact', existingContact);
                    if (
                      existingContact &&
                      existingContact.id &&
                      contact &&
                      contact.id &&
                      existingContact.id === contact.id
                    ) {
                      found = true;
                      newContacts.push(contact);
                    } else if (existingContact && existingContact.id) {
                      newContacts.push(existingContact);
                    }
                  });
                  if (!found && contact && contact.id) {
                    newContacts.push(contact);
                  }
                  contacts = newContacts;
                }
                if (contacts === [null]) {
                  contacts = [];
                }
                let stringifiedContacts = JSON.stringify(contacts);
                AsyncStorage.setItem(
                  '@MySuperStore:contacts',
                  stringifiedContacts
                )
                  //AsyncStorage.removeItem('@MySuperStore:tickets')
                  .then(() => {
                    navigation.navigate('Contacts');
                  });
              }
            );
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
