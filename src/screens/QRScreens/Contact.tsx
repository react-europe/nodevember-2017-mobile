import React from 'react';
import {useRecoilState} from 'recoil';

import {GQL} from '../../constants';
import {ticketState} from '../../context/ticketState';
import QR_CONTACT_QUERY from '../../data/qrContactQuery';
import {User, Attendee} from '../../typings/data';
import {AppNavigationProp} from '../../typings/navigation';
import {addContact, getTickets} from '../../utils';
import client from '../../utils/gqlClient';
import {saveNewContact} from '../../utils/storage';
import QRScreen from './QRScreen';

type Props = {
  navigation: AppNavigationProp<'QRContactScanner'>;
};

export default function QRContactScannerModalNavigation(props: Props) {
  const [tickets, setTickets] = useRecoilState(ticketState);

  const _handleContactBarCodeRead = async (data: string) => {
    let userTickets: User[] = [];
    if (!tickets) {
      userTickets = await getTickets();
      setTickets(userTickets);
    } else {
      userTickets = tickets;
    }
    if (!tickets || tickets.length < 0) {
      return;
    }
    let uuid = '';
    const contactRef = data;
    userTickets.map(async (ticket: User) => {
      if (ticket.checkinLists) {
        ticket.checkinLists.map((ch) => {
          if (ch?.mainEvent && ticket?.uuid) {
            uuid = ticket.uuid;
          }
        });
      }
      const variables = {slug: GQL.slug, uuid, q: contactRef};

      const scannedContact = await client.query({
        query: QR_CONTACT_QUERY,
        variables,
      });
      if (scannedContact?.data?.events[0]?.attendees[0]) {
        const contact = scannedContact.data.events[0].attendees[0];
        // console.log('new contact', contact);
        // console.log('new contact query', QR_CONTACT_QUERY);
        // console.log('new contact query variables', variables);
        saveNewContact(contact);
        props.navigation.navigate('Home', {screen: 'Contacts'});
      }
    });
    const variables = {slug: GQL.slug, uuid, q: contactRef};
    const scannedContact = await client.query({
      query: QR_CONTACT_QUERY,
      variables,
    });
    if (scannedContact?.data?.events[0]?.attendees[0]) {
      const contact: Attendee = scannedContact.data.events[0].attendees[0];
      await addContact(contact);
      props.navigation.navigate('Home', {screen: 'Contacts'});
    }
  };

  return (
    <QRScreen
      title="Scan a badge's QR code"
      onBarCodeScanned={_handleContactBarCodeRead}
    />
  );
}
