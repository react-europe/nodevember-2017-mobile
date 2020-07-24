import {gql} from 'apollo-boost';
import React, {useState, useEffect, useContext} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import {useRecoilValue} from 'recoil';

import LinkButton from '../components/LinkButton';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {AdminTicket} from '../typings/data';
import client from '../utils/gqlClient';

const ADMIN_GET_TICKETS = gql`
  query Tickets($id: Int!, $token: String!) {
    adminEvents(id: $id, token: $token) {
      tickets {
        id
        name
        description
      }
    }
  }
`;

function Ticket({ticket}: {ticket: AdminTicket}) {
  return (
    <View style={styles.row}>
      <LinkButton
        style={styles.linkButton}
        to={'/menu/edit-ticket?ticketId=' + ticket.id}>
        <Text>{ticket.name}</Text>
      </LinkButton>
    </View>
  );
}

export default function Tickets() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const {event} = useContext(DataContext);
  const adminToken = useRecoilValue(adminTokenState);

  async function fetchTickets() {
    if (!adminToken?.token || !event?.id) {
      setLoading(false);
      return;
    }
    try {
      const result = await client.query({
        query: ADMIN_GET_TICKETS,
        fetchPolicy: 'no-cache',
        variables: {
          id: event.id,
          token: adminToken.token,
        },
      });
      setTickets(result.data.adminEvents.tickets);
    } catch (e) {
      console.log('ERROR: ', e);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTickets();
  }, [adminToken, event]);

  const renderItem = ({item}: {item: AdminTicket}) => {
    return <Ticket ticket={item} />;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating />
      </View>
    );
  }
  return (
    <FlatList
      data={tickets}
      renderItem={renderItem}
      keyExtractor={(item, index) =>
        item.id ? item.id.toString() : index.toString()
      }
    />
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    flexDirection: 'row',
  },
  linkButton: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
