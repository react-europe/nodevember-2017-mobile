import {FontAwesome} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import React, {useContext, useCallback, useState} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
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
import {getSpeakerTalk, getAdminToken} from '../utils';

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
  const {event} = useContext(DataContext);
  const [adminToken, setAdminToken] = useRecoilState(adminTokenState);
  let speakers: Speaker[] = [];
  const [searchQuery, setSearchQuery] = useState('');
  if (event?.speakers && event.speakers.length > 0) {
    speakers = event.speakers as Speaker[];
  }

  async function updateAdminToken() {
    if (!event?.slug) return;
    const token = await getAdminToken(event, adminToken);
    if (!token) return;
    setAdminToken({token, edition: event.slug});
  }

  useFocusEffect(
    useCallback(() => {
      updateAdminToken();
    }, [adminToken, event])
  );

  const _renderItem = ({item}: {item: Speaker}) => {
    const token = adminToken?.token ? !!adminToken.token : false;
    return <SpeakerRow item={item} admin={token} />;
  };

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <LoadingPlaceholder>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <SectionList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        stickySectionHeadersEnabled
        renderItem={_renderItem}
        sections={[{data: speakers ? speakers : [], title: 'Speakers'}]}
        keyExtractor={(item, index) => index.toString()}
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
