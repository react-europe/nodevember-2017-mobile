import * as WebBrowser from 'expo-web-browser';
import React, {useContext} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import {ScrollView, RectButton} from 'react-native-gesture-handler';

import CachedImage from '../components/CachedImage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText, RegularText} from '../components/StyledText';
import {Layout} from '../constants';
import DataContext from '../context/DataContext';
import {Sponsor} from '../typings/data';
import {SectionHeaderProps} from '../typings/utils';
import useScreenWidth from '../utils/useScreenWidth';

type SponsorRowProps = {
  item: Sponsor;
};

function SponsorRow(props: SponsorRowProps) {
  const sponsor = props.item;
  const isLargeScreen = useScreenWidth();

  const _handlePress = () => {
    if (sponsor.url) {
      WebBrowser.openBrowserAsync(sponsor.url);
    }
  };

  const _handlePressJobUrl = () => {
    if (sponsor.jobUrl) {
      WebBrowser.openBrowserAsync(sponsor.jobUrl);
    }
  };

  return (
    <RectButton
      onPress={_handlePress}
      activeOpacity={0.05}
      style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.row}>
        <View
          style={[
            styles.rowData,
            {
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: sponsor.description ? 15 : 5,
              marginTop: 10,
            },
          ]}>
          <FadeIn placeholderStyle={{borderRadius: 3}}>
            {sponsor.logoUrl && (
              <CachedImage
                source={{uri: sponsor.logoUrl}}
                style={{
                  width: Layout.window.width / 2,
                  height: 80,
                  borderRadius: 0,
                  resizeMode: 'contain',
                }}
              />
            )}
          </FadeIn>
        </View>
        {sponsor.description ? (
          <View
            style={(styles.rowData, isLargeScreen && {alignItems: 'center'})}>
            <RegularText
              style={[{marginBottom: 10}, isLargeScreen && styles.textWeb]}
              fontSize="sm">
              {sponsor.description}
            </RegularText>
          </View>
        ) : null}
        <PrimaryButton onPress={_handlePressJobUrl}>
          <SemiBoldText fontSize="md" TextColorAccent>
            Work with {sponsor.name}
          </SemiBoldText>
        </PrimaryButton>
      </View>
    </RectButton>
  );
}

export default function Sponsors() {
  const {event} = useContext(DataContext);
  if (!event?.sponsors) {
    return <></>;
  }
  const SponsorsData: {[key: string]: Sponsor[]} = event.sponsors as {
    [key: string]: Sponsor[];
  };
  let SponsorsByLevel: {title: string; data: Sponsor[]}[] = [];
  const levels = [
    {title: 'Diamond', key: 'diamond'},
    {title: 'Platinum', key: 'platinum'},
    {title: 'Gold', key: 'gold'},
    {title: 'Partners', key: 'partner'},
  ];
  if (SponsorsData) {
    SponsorsByLevel = levels.map(({title, key}) => {
      return {title, data: SponsorsData[key] ? SponsorsData[key] : []};
    });
  }

  const _renderSectionHeader = ({section}: SectionHeaderProps<Sponsor>) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText fontSize="sm">{section.title}</RegularText>
      </View>
    );
  };

  const _renderItem = ({item}: {item: Sponsor}) => {
    return <SponsorRow item={item} />;
  };

  return (
    <LoadingPlaceholder>
      {SponsorsByLevel.length && (
        <SectionList
          renderScrollComponent={(props) => <ScrollView {...props} />}
          stickySectionHeadersEnabled
          sections={SponsorsByLevel}
          renderSectionHeader={_renderSectionHeader}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={4}
        />
      )}
    </LoadingPlaceholder>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  rowData: {
    flex: 1,
  },
  textWeb: {
    maxWidth: 900,
    textAlign: 'center',
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
