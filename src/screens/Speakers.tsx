import React, {useContext} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import {ScrollView, RectButton} from 'react-native-gesture-handler';

import CachedImage from '../components/CachedImage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {BoldText, SemiBoldText, RegularText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {Speaker, Talk} from '../typings/data';
import {MenuNavigationProp} from '../typings/navigation';
import {SectionHeaderProps} from '../typings/utils';
import {getSpeakerTalk} from '../utils';

type SpeakersProps = {
  navigation: MenuNavigationProp<'Speakers'>;
};

type SpeakerRowProps = {
  item: Speaker;
  onPress: (speaker: Speaker) => void;
};

function SpeakerRow(props: SpeakerRowProps) {
  const {item: speaker} = props;
  const talk: Talk | null = getSpeakerTalk(speaker);

  const _handlePress = () => {
    props.onPress(props.item);
  };

  return (
    <RectButton
      onPress={_handlePress}
      activeOpacity={0.05}
      style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.row}>
        <View style={styles.rowAvatarContainer}>
          <FadeIn>
            {speaker.avatarUrl && (
              <CachedImage
                source={{uri: speaker.avatarUrl}}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
            )}
          </FadeIn>
        </View>
        <View style={styles.rowData}>
          <BoldText fontSize="sm">{speaker.name}</BoldText>
          {speaker.twitter ? (
            <SemiBoldText fontSize="sm">@{speaker.twitter}</SemiBoldText>
          ) : null}
          {talk && <RegularText fontSize="sm">{talk.title}</RegularText>}
        </View>
      </View>
    </RectButton>
  );
}

export default function Speakers(props: SpeakersProps) {
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
    return <SpeakerRow item={item} onPress={_handlePressRow} />;
  };

  const _handlePressRow = (speaker: Speaker) => {
    props.navigation.navigate('Details', {speaker});
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
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    flexDirection: 'row',
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
