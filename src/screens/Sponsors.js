import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import * as WebBrowser from 'expo-web-browser';
import {ScrollView, RectButton} from 'react-native-gesture-handler';

import {Layout, FontSizes, Colors} from '../constants';
import {SemiBoldText, RegularText} from '../components/StyledText';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import CachedImage from '../components/CachedImage';
import {withData} from '../context/DataContext';

const ClipBorderRadius = ({children, style}) => {
  return (
    <View
      style={[
        {borderRadius: BORDER_RADIUS, overflow: 'hidden', marginTop: 10},
        style,
      ]}>
      {children}
    </View>
  );
};

const BORDER_RADIUS = 3;

function SponsorRow(props) {
  const {item: sponsor} = props;

  const _handlePress = () => {
    WebBrowser.openBrowserAsync(props.item.url);
  };

  const _handlePressJobUrl = () => {
    WebBrowser.openBrowserAsync(props.item.jobUrl);
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
            <CachedImage
              source={{uri: sponsor.logoUrl}}
              style={{
                width: Layout.window.width / 2,
                height: 80,
                borderRadius: 0,
                resizeMode: 'contain',
              }}
            />
          </FadeIn>
        </View>
        {sponsor.description ? (
          <View style={styles.rowData}>
            <RegularText style={{marginBottom: 10}}>
              {sponsor.description}
            </RegularText>
          </View>
        ) : null}
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={_handlePressJobUrl}
            underlayColor="#fff">
            <SemiBoldText style={styles.bigButtonText}>
              Work with {sponsor.name}
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      </View>
    </RectButton>
  );
}

function Sponsors(props) {
  const event = props.event;
  const SponsorsData = event.sponsors;
  const SponsorsByLevel = [
    {title: 'Diamond', data: SponsorsData['diamond']},
    {title: 'Platinum', data: SponsorsData['platinum']},
    {title: 'Gold', data: SponsorsData['gold']},
    {title: 'Partners', data: SponsorsData['partner']},
  ];

  const _renderSectionHeader = ({section}) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText>{section.title}</RegularText>
      </View>
    );
  };

  const _renderItem = ({item}) => {
    return <SponsorRow item={item} />;
  };

  return (
    <LoadingPlaceholder>
      <SectionList
        renderScrollComponent={props => <ScrollView {...props} />}
        stickySectionHeadersEnabled={true}
        sections={SponsorsByLevel}
        renderSectionHeader={_renderSectionHeader}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={4}
      />
    </LoadingPlaceholder>
  );
}

const styles = StyleSheet.create({
  bigButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
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

export default withData(Sponsors);
