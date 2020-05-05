import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';

import {User} from '../typings/data';
import {SemiBoldText} from './StyledText';
import TicketCard from './TicketCard';

type Props = {
  tickets: User[];
  style: StyleProp<ViewStyle>;
};

export default function Tickets(props: Props) {
  const tix: User[] = props.tickets || [];

  /* function _renderDateTime() {
    if (conferenceHasEnded()) {
      return null;
    }

    const {dateTime} = state;

    if (dateTime) {
      return (
        <RegularText style={styles.time}>
          {convertUtcDateToEventTimezoneDaytime(dateTime)}
        </RegularText>
      );
    } else {
      // handle after conf thing
    }
  } */

  return (
    <View style={[{marginHorizontal: 10}, props.style]}>
      <SemiBoldText fontSize="lg">My Tickets</SemiBoldText>
      {tix.map((ticket, index) =>
        ticket ? (
          <TicketCard
            key={index}
            ticket={ticket}
            style={{marginTop: 10, marginBottom: 10}}
          />
        ) : null
      )}
    </View>
  );
}

/* const styles = StyleSheet.create({
  time: {
    color: Colors.faint,
    fontSize: FontSizes.subtitle,
  },
}); */
