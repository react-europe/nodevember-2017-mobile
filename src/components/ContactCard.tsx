import React from 'react';
import {Text, Platform, StyleSheet, View} from 'react-native';
import {
  Button,
  CardActions,
  CardContent,
  Title,
  Paragraph,
  Card,
} from 'react-native-paper';

import CachedImage from '../components/CachedImage';
import GravatarImage from '../components/GravatarImage';
import {Colors, FontSizes} from '../constants';
import {User} from '../data/data';
import {sendEmail, openTwitter, getContactTwitter} from '../utils';

type Props = {
  contact: User;
  tickets: User[];
};

function ContactCard({contact, tickets}: Props) {
  const bio: string | null = getContactBio();
  const twitter: string | null = getContactTwitter(contact);

  const _handlePressTwitterButton = () => {
    const twitter = getContactTwitter(contact);
    openTwitter(twitter);
  };

  const _handlePressEmailButton = () => {
    const emailTo = contact.email;
    if (tickets[0]?.firstName && tickets[0]?.lastName) {
      sendEmail(emailTo, {
        firstName: tickets[0].firstName,
        lastName: tickets[0].lastName,
      });
    }
  };

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
    <Card>
      <View style={{flex: 1, flexDirection: 'row'}}>
        {contact.email && (
          <GravatarImage style={styles.avatarImage} email={contact.email} />
        )}
        <View style={{flex: 1}}>
          <CardContent>
            <Title>{contact.firstName + ' ' + contact.lastName}</Title>
            {bio && <Paragraph>{bio}</Paragraph>}
          </CardContent>
          <CardActions>
            {twitter && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <CachedImage
                  source={require('../assets/twitter.png')}
                  style={{
                    tintColor: '#00AAE4',
                    height: 40,
                    width: 40,
                    resizeMode: 'cover',
                  }}
                />
                <Button compact onPress={_handlePressTwitterButton}>
                  <Text>@{twitter}</Text>
                </Button>
              </View>
            )}
            {tickets[0]?.firstName && tickets[0]?.lastName && (
              <Button onPress={_handlePressEmailButton}>EMAIL</Button>
            )}
          </CardActions>
        </View>
      </View>
    </Card>
  );
}

export default ContactCard;

const styles = StyleSheet.create({
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: 8,
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
  },
  headerRowAvatarContainer: {
    paddingRight: 10,
  },
  headerRowInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  speakerName: {
    fontSize: FontSizes.bodyTitle,
  },
  organizationName: {
    color: Colors.faint,
    fontSize: FontSizes.bodyLarge,
  },
  ticketInfoRow: {
    paddingTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  ticketTitle: {
    fontSize: FontSizes.bodyTitle,
  },
  ticketLocation: {
    fontSize: FontSizes.bodyLarge,
    color: Colors.faint,
    marginTop: 10,
  },
  nextYear: {
    textAlign: 'center',
    fontSize: FontSizes.title,
    marginVertical: 10,
  },
  button: {
    padding: 15,
    ...Platform.select({
      ios: {
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: {width: 2, height: 2},
      },
      android: {
        backgroundColor: '#fff',
        elevation: 2,
      },
    }),
  },
});
