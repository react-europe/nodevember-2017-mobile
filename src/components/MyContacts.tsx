import React from 'react';
import {Alert, Clipboard, View, ViewStyle, StyleProp} from 'react-native';

import {Attendee} from '../typings/data';
import {getContactTwitter} from '../utils';
import PrimaryButton from './Buttons/PrimaryButton';
import ContactCard from './ContactCard';
import {SemiBoldText} from './StyledText';

type Props = {
  contacts: Attendee[];
  tickets: Attendee[];
  style?: StyleProp<ViewStyle>;
};

export default function MyContacts(props: Props) {
  const contacts = props.contacts;

  const _handlePressCopyEmails = () => {
    let contacts = 'first name,last name,email,twitter\n';
    props.contacts.map((contact) => {
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

  return (
    <View style={[{marginHorizontal: 10}, props.style]}>
      <SemiBoldText fontSize="lg">My Contacts</SemiBoldText>
      {contacts && contacts.length > 0 ? (
        <PrimaryButton onPress={_handlePressCopyEmails}>
          <SemiBoldText fontSize="md" accent>
            Copy all emails to clipboard
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      {contacts.map((contact) => {
        if (contact?.id && contact?.email) {
          return (
            <ContactCard
              key={contact.id + contact.email}
              contact={contact}
              tickets={props.tickets}
            />
          );
        }
        return null;
      })}
    </View>
  );
}
