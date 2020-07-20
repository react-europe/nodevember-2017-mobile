import {FontAwesome} from '@expo/vector-icons';
import Fuse from 'fuse.js';
import React, {useContext, useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Picker, TouchableOpacity} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {Searchbar, ActivityIndicator} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import CachedImage from '../components/CachedImage';
import ImageFadeIn from '../components/ImageFadeIn';
import LinkButton from '../components/LinkButton';
import {BoldText, SemiBoldText, RegularText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {ADMIN_GET_SPEAKERS, UPDATE_SPEAKER_POSITION} from '../data/speakers';
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

type SpeakerDescriptionProps = {
  speaker: Speaker | AdminSpeaker;
  talk: Talk | undefined;
};

function SpeakerAvatar({avatarUrl}: {avatarUrl: string | null | undefined}) {
  return (
    <ImageFadeIn>
      {avatarUrl && (
        <CachedImage
          source={{uri: avatarUrl}}
          style={{width: 50, height: 50, borderRadius: 25}}
        />
      )}
    </ImageFadeIn>
  );
}

function SpeakerDescription({speaker, talk}: SpeakerDescriptionProps) {
  return (
    <>
      <LinkButton to={'/details?speakerId=' + speaker.id}>
        <BoldText fontSize="sm">{speaker.name}</BoldText>
      </LinkButton>
      {speaker.twitter ? (
        <SemiBoldText fontSize="sm">@{speaker.twitter}</SemiBoldText>
      ) : null}
      {talk && (
        <RegularText style={{paddingRight: 2}} fontSize="sm">
          {talk.title}
        </RegularText>
      )}
    </>
  );
}

export function SpeakerRow(props: SpeakerRowProps) {
  const {item, admin} = props;
  const talk: Talk | undefined = getSpeakerTalk(item as Speaker);

  return (
    <View style={styles.row}>
      <View style={styles.rowAvatarContainer}>
        {admin ? (
          <SpeakerAvatar avatarUrl={item.avatarUrl} />
        ) : (
          <LinkButton to={'/details?speakerId=' + item.id}>
            <SpeakerAvatar avatarUrl={item.avatarUrl} />
          </LinkButton>
        )}
      </View>
      <View style={styles.rowData}>
        {admin ? (
          <SpeakerDescription speaker={item} talk={talk} />
        ) : (
          <LinkButton to={'/details?speakerId=' + item.id}>
            <SpeakerDescription speaker={item} talk={talk} />
          </LinkButton>
        )}
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
          query: ADMIN_GET_SPEAKERS,
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
    }
    const newSpeakersPosition = data.map((speaker) => {
      return {id: speaker.id, displayOrder: speaker.displayOrder};
    });
    try {
      client.mutate({
        mutation: UPDATE_SPEAKER_POSITION,
        variables: {
          token: adminToken?.token,
          speakers: newSpeakersPosition,
        },
      });
    } catch (e) {
      console.log(e);
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
        onDragEnd={({data}) => updatePosition(data as AdminSpeaker[])}
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
