import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ViewStyle, StyleProp} from 'react-native';
import {Button, Card, Title} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

import {User} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';

type Props = {
  ticket: User;
  style?: StyleProp<ViewStyle>;
};

function TicketCard(props: Props) {
  const navigation = useNavigation<PrimaryTabNavigationProp<'Profile'>>();
  const {ticket} = props;

  const _handlePress = () => {
    navigation.navigate('TicketInstructions', {
      ticket: props.ticket,
    });
  };

  return (
    <Card>
      <Card.Content>
        {ticket.checkinLists && (
          <>
            <Title style={{color: 'black'}}>ticket gives you access to:</Title>
            {ticket.checkinLists.map((ch) => {
              if (ch?.id && ch?.name) {
                return (
                  <Title style={{color: 'black'}} key={ch.id}>
                    ✓ {ch.name}
                  </Title>
                );
              }
              return null;
            })}
          </>
        )}
        {ticket.ref && <QRCode value={ticket.ref} size={300} />}
        <Button labelStyle={{color: 'black'}} onPress={_handlePress}>
          Read useful info
        </Button>
      </Card.Content>
    </Card>
  );
}

export default TicketCard;
