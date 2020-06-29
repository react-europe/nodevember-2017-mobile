import React, {useContext} from 'react';
import {useRecoilState} from 'recoil';

import {GQL} from '../../constants';
import DataContext from '../../context/DataContext';
import {contactState} from '../../context/contactState';
import {ticketState} from '../../context/ticketState';
import QR_CONTACT_QUERY from '../../data/qrContactQuery';
import {User} from '../../typings/data';
import {AppNavigationProp} from '../../typings/navigation';
import {getTickets} from '../../utils';
import client from '../../utils/gqlClient';
import {saveNewContact} from '../../utils/storage';
import QRScreen from './QRScreen';

type Props = {
  navigation: AppNavigationProp<'QRContactScanner'>;
};

export default function QRContactScannerModalNavigation(props: Props) {
  const [tickets, setTickets] = useRecoilState(ticketState);
  const [contacts, setContacts] = useRecoilState(contactState);
  const {event} = useContext(DataContext);

  const _handleContactBarCodeRead = async (data: string) => {
    let userTickets: User[] | null = [];
    if (!tickets && event?.slug) {
      userTickets = await getTickets(event.slug);
      setTickets(userTickets);
    } else {
      userTickets = tickets;
    }
    if (!tickets || tickets.length < 0) {
      return;
    }
    let uuid = '';
    const contactRef = data;
    if (!userTickets) return;
    for (const ticket of userTickets) {
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
        const newContacts = await saveNewContact(contact, contacts);
        setContacts(newContacts);
        props.navigation.navigate('Home', {screen: 'Contacts'});
      }
    }
  };

  return (
    <QRScreen
      title="Scan a badge's QR code"
      onBarCodeScanned={_handleContactBarCodeRead}
    />
  );
}
