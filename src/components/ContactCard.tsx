import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Button, Paragraph, Card} from 'react-native-paper';

import GravatarImage from '../components/GravatarImage';
import {Attendee, User} from '../typings/data';
import {sendEmail, openTwitter, getContactTwitter} from '../utils';
import {saveContactOnDevice} from '../utils/storage';
import {SemiBoldText, RegularText} from './StyledText';

type Props = {
  contact: Attendee;
  tickets: User[];
};

function ContactCard({contact, tickets}: Props) {
  const bio: string | null = getContactBio();
  const twitter: string | null = null;

  const _handlePressTwitterButton = () => {
    const twitter = getContactTwitter(contact);
    openTwitter(twitter);
  };

  const _handlePressEmailButton = () => {
    const emailTo = contact.email;
    if (tickets[0]?.firstName && tickets[0]?.lastName && emailTo) {
      sendEmail(emailTo, {
        firstName: tickets[0].firstName,
        lastName: tickets[0].lastName,
      });
    }
  };

  async function handleAddContact() {
    saveContactOnDevice(contact);
  }

  function getContactBio() {
    let bio: string | null = null;
    if (contact?.answers) {
      contact.answers.map((answer) => {
        if (answer?.question?.id && answer.question.id === 56) {
          if (answer.value) {
            bio = answer.value;
          }
        }
      });
    }
    return bio;
  }

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        {contact.email && (
          <GravatarImage style={styles.avatarImage} email={contact.email} />
        )}
        <View style={{flex: 1}}>
          <Card.Content>
            <SemiBoldText fontSize="lg">
              {contact.firstName + ' ' + contact.lastName}
            </SemiBoldText>
            {bio && <Paragraph>{bio}</Paragraph>}
          </Card.Content>
          <Card.Actions>
            {tickets[0]?.firstName && tickets[0]?.lastName && (
              <Button onPress={_handlePressEmailButton}>
                <RegularText fontSize="md">EMAIL</RegularText>
              </Button>
            )}
            {Platform.OS !== 'web' && (
              <Button onPress={handleAddContact}>
                <RegularText>
                  <Ionicons
                    name={
                      Platform.OS === 'ios' ? 'ios-person-add' : 'md-person-add'
                    }
                    size={Platform.OS === 'ios' ? 40 : 30}
                    style={styles.icon}
                  />
                </RegularText>
              </Button>
            )}
            {twitter && (
              <Button onPress={_handlePressTwitterButton}>
                <Ionicons
                  name="logo-twitter"
                  size={Platform.OS === 'ios' ? 40 : 30}
                  style={[styles.icon, {color: '#00AAE4'}]}
                />
                <RegularText fontSize="sm">@{twitter}</RegularText>
              </Button>
            )}
          </Card.Actions>
        </View>
      </View>
    </Card>
  );
}

export default ContactCard;

const styles = StyleSheet.create({
  icon: {
    paddingHorizontal: 4,
  },
  card: {
    marginTop: 2,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: 8,
    marginTop: 8,
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
  },
});
