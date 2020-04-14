import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import withNavigation from '../utils/withNavigation';
import {RegularText} from './StyledText';
import {Colors, FontSizes} from '../constants';
import {Button, Card, CardContent, Title} from 'react-native-paper';

function TicketCard(props) {
  const {ticket} = props;

  const _handlePress = () => {
    props.navigation.navigate('TicketInstructions', {
      ticket: props.ticket,
    });
  };

  const _renderPlaceholderForNextYear = () => {
    return (
      <View style={[styles.button, props.style]}>
        <RegularText style={styles.nextYear}>See you in 2019!</RegularText>
      </View>
    );
  };

  return (
    <Card key={ticket.id}>
      <CardContent>
        <Title>ticket gives you access to:</Title>
        {ticket.checkinLists.map(ch => (
          <Title key={ch.id}>✓ {ch.name}</Title>
        ))}
        <QRCode style={{flex: 1}} value={ticket.ref} size={300} />
        <Button onPress={_handlePress}>Read useful info</Button>
      </CardContent>
    </Card>
  );
}

export default withNavigation(TicketCard);

const styles = StyleSheet.create({
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
