import {gql} from 'apollo-boost';
import Fuse from 'fuse.js';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Text, ActivityIndicator, Searchbar} from 'react-native-paper';
import {useRecoilValue} from 'recoil';

import LinkButton from '../components/LinkButton';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {CheckinList} from '../typings/data';
import client from '../utils/gqlClient';

const ADMIN_GET_CHECKINLISTS = gql`
  query fetchCheckinLists($id: Int!, $token: String!) {
    adminEvents(id: $id, token: $token) {
      checkinLists {
        id
        name
      }
    }
  }
`;

function CheckinListItem({checkinList}: {checkinList: CheckinList}) {
  return (
    <View style={styles.row}>
      <LinkButton
        style={styles.linkButton}
        to={'/menu/edit-checkin-list?checkinListId=' + checkinList.id}>
        <Text>{checkinList.name}</Text>
      </LinkButton>
    </View>
  );
}

export default function CheckinLists() {
  /* Fuse.js config */
  const options = {
    keys: ['name'],
    threshold: 0.4,
  };

  const [checkinLists, setCheckinLists] = useState<CheckinList[]>([]);
  const [loading, setLoading] = useState(true);
  const {event} = useContext(DataContext);
  const adminToken = useRecoilValue(adminTokenState);
  const [searchQuery, setSearchQuery] = useState('');
  const allCheckinLists = useRef<CheckinList[]>([]);
  const fuse = useRef<any>();

  function updateCheckinLists() {
    if (searchQuery.length === 0) {
      setCheckinLists(allCheckinLists.current);
    } else {
      let result: any = fuse.current.search(searchQuery);
      result = result.map((match: any) => match.item);
      setCheckinLists(result);
    }
  }

  useEffect(() => {
    updateCheckinLists();
  }, [searchQuery]);

  async function fetchCheckinLists() {
    if (!adminToken?.token || !event?.id) {
      setLoading(false);
      return;
    }
    try {
      const result = await client.query({
        query: ADMIN_GET_CHECKINLISTS,
        fetchPolicy: 'no-cache',
        variables: {
          id: event.id,
          token: adminToken.token,
        },
      });
      setCheckinLists(result.data.adminEvents.checkinLists);
      allCheckinLists.current = result.data.adminEvents.checkinLists;
      fuse.current = new Fuse(result.data.adminEvents.checkinLists, options);
      updateCheckinLists();
    } catch (e) {
      console.log('ERROR: ', e);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCheckinLists();
  }, [adminToken, event]);

  const renderItem = ({item}: {item: CheckinList}) => {
    return <CheckinListItem checkinList={item} />;
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
        data={checkinLists}
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
