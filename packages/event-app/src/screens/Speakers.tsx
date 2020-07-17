import {FontAwesome} from '@expo/vector-icons';
import {gql} from 'apollo-boost';
import Fuse from 'fuse.js';
import React, {useContext, useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Picker, TouchableOpacity} from 'react-native';
import {Searchbar, ActivityIndicator} from 'react-native-paper';
import {useRecoilState, isRecoilValue} from 'recoil';
import DraggableFlatList from 'react-native-draggable-flatlist';

import CachedImage from '../components/CachedImage';
import ImageFadeIn from '../components/ImageFadeIn';
import LinkButton from '../components/LinkButton';
import {BoldText, SemiBoldText, RegularText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {Speaker, Talk, AdminSpeaker} from '../typings/data';
import {getSpeakerTalk} from '../utils';
import client from '../utils/gqlClient';

type SpeakerRowProps = {
  item: Speaker | AdminSpeaker;
  admin: boolean;
};

type RenderItemProps = {
  item: Speaker | AdminSpeaker;
  drag: () => void;
};

const GET_SPEAKERS = gql`
  query fetchAllSpeakers($token: String!, $id: Int!, $status: Int!) {
    adminEvents(id: $id, token: $token) {
      id
      adminSpeakers(status: $status) {
        id
        name
        twitter
        github
        bio
        avatarUrl
        displayOrder
        talks {
          title
          id
        }
      }
    }
  }
`;

const UPDATE_SPEAKER_POSITION = gql`
  mutation updateSpeaker(
    $id: Int!
    $token: String!
    $name: String!
    $displayOrder: Int!
  ) {
    updateSpeaker(
      id: $id
      token: $token
      name: $name
      displayOrder: $displayOrder
    ) {
      name
      displayOrder
    }
  }
`;

export function SpeakerRow(props: SpeakerRowProps) {
  const {item, admin} = props;
  const talk: Talk | undefined = getSpeakerTalk(item as Speaker);

  return (
    <View style={styles.row}>
      <View style={styles.rowAvatarContainer}>
        {admin ? (
          <ImageFadeIn>
            {item.avatarUrl && (
              <CachedImage
                source={{uri: item.avatarUrl}}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
            )}
          </ImageFadeIn>
        ) : (
          <LinkButton to={'/details?speakerId=' + item.id}>
            <ImageFadeIn>
              {item.avatarUrl && (
                <CachedImage
                  source={{uri: item.avatarUrl}}
                  style={{width: 50, height: 50, borderRadius: 25}}
                />
              )}
            </ImageFadeIn>
          </LinkButton>
        )}
      </View>
      <View style={styles.rowData}>
        <LinkButton to={'/details?speakerId=' + item.id}>
          <BoldText fontSize="sm">{item.name}</BoldText>
          {item.twitter ? (
            <SemiBoldText fontSize="sm">@{item.twitter}</SemiBoldText>
          ) : null}
          {talk && (
            <RegularText style={{paddingRight: 2}} fontSize="sm">
              {talk.title}
            </RegularText>
          )}
        </LinkButton>
      </View>
      {admin && (
        <LinkButton
          to={'/menu/edit-speaker?speakerId=' + item.id}
          style={{alignSelf: 'center'}}>
          <FontAwesome name="edit" size={24} color="black" />
        </LinkButton>
      )}
    </View>
  );
}

export default function Speakers() {
  /* Fuse.js config */
  const options = {
    keys: ['name', 'twitter', 'github', 'bio'],
    threshold: 0.4,
  };

  const {event} = useContext(DataContext);
  const [adminToken] = useRecoilState(adminTokenState);
  const [speakers, setSpeakers] = useState<Speaker[] | AdminSpeaker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const allSpeakers = useRef<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const fuse = useRef<any>();
  const [status, setStatus] = useState(1);

  function updateSpeakers() {
    if (searchQuery.length === 0) {
      setSpeakers(allSpeakers.current);
    } else {
      let result: any = fuse.current.search(searchQuery);
      result = result.map((match: any) => match.item);
      setSpeakers(result);
    }
  }

  useEffect(() => {
    updateSpeakers();
  }, [searchQuery]);

  async function fetchSpeakers() {
    setLoading(true);
    if (adminToken?.token) {
      try {
        const result = await client.query({
          query: GET_SPEAKERS,
          fetchPolicy: 'no-cache',
          variables: {
            id: event?.id,
            token: adminToken?.token,
            status,
          },
        });
        allSpeakers.current = result.data.adminEvents.adminSpeakers;
        fuse.current = new Fuse(result.data.adminEvents.adminSpeakers, options);
        updateSpeakers();
      } catch (e) {
        console.log('ERROR: ', e);
      }
    } else {
      if (!event?.speakers) return;
      allSpeakers.current = event.speakers as Speaker[];
      fuse.current = new Fuse(event.speakers, options);
      updateSpeakers();
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSpeakers();
  }, [status, adminToken, event]);

  const _renderItem = ({item, drag}: RenderItemProps) => {
    const token = adminToken?.token ? !!adminToken.token : false;
    if (token) {
      return (
        <TouchableOpacity onLongPress={drag}>
          <SpeakerRow item={item} admin={token} />
        </TouchableOpacity>
      );
    } else {
      return <SpeakerRow item={item} admin={token} />;
    }
  };

  const onChangeSearch = (query: string) => setSearchQuery(query);

  function updatePosition(data: AdminSpeaker[]) {
    for (let i = 0; i < data.length; i++) {
      data[i].displayOrder = i;
      try {
        client.mutate({
          mutation: UPDATE_SPEAKER_POSITION,
          variables: {
            id: data[i].id,
            token: adminToken?.token,
            name: data[i].name,
            displayOrder: data[i].displayOrder,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
    setSpeakers(data);
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating />
      </View>
    );
  }

  console.log('START');
  for (const i of speakers) {
    console.log(i.displayOrder);
  }

  return (
    <>
      <View style={{flexDirection: 'row'}}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={{flex: 1}}
        />
        {adminToken?.token && (
          <Picker
            style={{width: '30%'}}
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}>
            <Picker.Item label="Unconfirmed" value={0} />
            <Picker.Item label="Confirmed" value={1} />
            <Picker.Item label="Rejected" value={2} />
          </Picker>
        )}
      </View>
      <DraggableFlatList
        data={speakers}
        renderItem={_renderItem}
        keyExtractor={(item, index) => item.id?.toString() as string}
        onDragEnd={({data}) => updatePosition(data)}
      />
      {/* <SectionList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        stickySectionHeadersEnabled
        renderItem={_renderItem}
        sections={[{data: speakers, title: 'Speakers'}]}
        keyExtractor={(item, index) =>
          item.name ? item.name + index : index.toString()
        }
      /> */}
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
    backgroundColor: '#fff',
  },
  rowAvatarContainer: {
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 0,
  },
  rowData: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
