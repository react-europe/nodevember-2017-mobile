import React, {useContext} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import {ScrollView} from 'react-native-gesture-handler';

import CachedImage from '../components/CachedImage';
import LinkButton from '../components/LinkButton';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {BoldText, SemiBoldText, RegularText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {Speaker, Talk} from '../typings/data';
import {SectionHeaderProps} from '../typings/utils';
import {getSpeakerTalk} from '../utils';

type SpeakerRowProps = {
  item: Speaker;
};

function SpeakerRow(props: SpeakerRowProps) {
  const {item} = props;
  const talk: Talk | undefined = getSpeakerTalk(item);

  return (
    <LinkButton to={'/details?speakerId=' + item.id} style={styles.linkButton}>
      <View style={styles.row}>
        <View style={styles.rowAvatarContainer}>
          <FadeIn>
            {item.avatarUrl && (
              <CachedImage
                source={{uri: item.avatarUrl}}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
            )}
          </FadeIn>
        </View>
        <View style={styles.rowData}>
          <BoldText fontSize="sm">{item.name}</BoldText>
          {item.twitter ? (
            <SemiBoldText fontSize="sm">@{item.twitter}</SemiBoldText>
          ) : null}
          {talk && <RegularText fontSize="sm">{talk.title}</RegularText>}
        </View>
      </View>
    </LinkButton>
  );
}

export default function Speakers() {
  const {event} = useContext(DataContext);
  let speakers: Speaker[] = [];
  if (event?.speakers && event.speakers.length > 0) {
    speakers = event.speakers as Speaker[];
  }
  const _renderSectionHeader = ({section}: SectionHeaderProps<Speaker>) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText fontSize="sm">{section.title}</RegularText>
      </View>
    );
  };

  const _renderItem = ({item}: {item: Speaker}) => {
    return <SpeakerRow item={item} />;
  };

  return (
    <LoadingPlaceholder>
      <SectionList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        stickySectionHeadersEnabled
        renderItem={_renderItem}
        renderSectionHeader={_renderSectionHeader}
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
