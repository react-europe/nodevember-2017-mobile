import {gql} from 'apollo-boost';
import Fuse from 'fuse.js';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Searchbar,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
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
        quantitySold
        quantity
      }
    }
  }
`;

function Ticket({ticket}: {ticket: AdminTicket}) {
  const {colors} = useTheme();
  let progress = 0;
  if (ticket.quantitySold && ticket.quantity) {
    progress = ticket.quantitySold / ticket.quantity;
  }
  return (
    <View style={styles.row}>
      <LinkButton
        style={styles.linkButton}
        to={'/menu/edit-ticket?ticketId=' + ticket.id}>
        <Text>{ticket.name}</Text>
        <ProgressBar
          style={{marginTop: 4}}
          progress={progress}
          color={colors.primary}
        />
      </LinkButton>
    </View>
  );
}

export default function Tickets() {
  /* Fuse.js config */
  const options = {
    keys: ['name', 'description'],
    threshold: 0.4,
  };

  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const {event} = useContext(DataContext);
  const adminToken = useRecoilValue(adminTokenState);
  const [searchQuery, setSearchQuery] = useState('');
  const allTickets = useRef<AdminTicket[]>([]);
  const fuse = useRef<any>();

  function updateTickets() {
    if (searchQuery.length === 0) {
      setTickets(allTickets.current);
    } else {
      let result: any = fuse.current.search(searchQuery);
      result = result.map((match: any) => match.item);
      setTickets(result);
    }
  }

  useEffect(() => {
    updateTickets();
  }, [searchQuery]);

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
      allTickets.current = result.data.adminEvents.tickets;
      fuse.current = new Fuse(result.data.adminEvents.tickets, options);
      updateTickets();
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

  const onChangeSearch = (query: string) => setSearchQuery(query);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating />
      </View>
    );
  }
  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        data={tickets}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
      />
    </>
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
