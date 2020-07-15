import {FontAwesome} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import Fuse from 'fuse.js';
import React, {useContext, useCallback, useState, useEffect} from 'react';
import {SectionList, StyleSheet, View, Picker} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Searchbar} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import CachedImage from '../components/CachedImage';
import ImageFadeIn from '../components/ImageFadeIn';
import LinkButton from '../components/LinkButton';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {BoldText, SemiBoldText, RegularText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {Speaker, Talk} from '../typings/data';
import {getSpeakerTalk} from '../utils';

type SpeakerRowProps = {
  item: Speaker;
  admin: boolean;
};

export function SpeakerRow(props: SpeakerRowProps) {
  const {item, admin} = props;
  const talk: Talk | undefined = getSpeakerTalk(item);

  return (
    <View style={styles.row}>
      <View style={styles.rowAvatarContainer}>
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
      </View>
      <View style={styles.rowData}>
        <LinkButton to={'/details?speakerId=' + item.id}>
          <BoldText fontSize="sm">{item.name}</BoldText>
          {item.twitter ? (
            <SemiBoldText fontSize="sm">@{item.twitter}</SemiBoldText>
          ) : null}
          {talk && <RegularText fontSize="sm">{talk.title}</RegularText>}
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
    keys: ['name'],
    threshold: 0.4,
  };

  const {event} = useContext(DataContext);
  const [adminToken] = useRecoilState(adminTokenState);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fuse = new Fuse(event?.speakers ? event?.speakers : [], options);
  const [status, setStatus] = useState(1);

  function updateSpeakers() {
    if (searchQuery.length === 0) {
      setSpeakers(event?.speakers as Speaker[]);
    } else {
      let result: any = fuse.search(searchQuery);
      result = result.map((match: any) => match.item);
      setSpeakers(result);
    }
  }

  useEffect(() => {
    updateSpeakers();
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      if (event?.speakers) {
        /* updateSpeakers(); */
      }
    }, [adminToken, event])
  );

  const _renderItem = ({item}: {item: Speaker}) => {
    const token = adminToken?.token ? !!adminToken.token : false;
    return <SpeakerRow item={item} admin={token} />;
  };

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <LoadingPlaceholder>
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
      <SectionList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        stickySectionHeadersEnabled
        renderItem={_renderItem}
        sections={[{data: speakers, title: 'Speakers'}]}
        keyExtractor={(item, index) =>
          item.name ? item.name + index : index.toString()
        }
      />
    </LoadingPlaceholder>
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
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
