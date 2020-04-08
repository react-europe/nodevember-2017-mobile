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

class SponsorRow extends React.Component {
  render() {
    const {item: sponsor} = this.props;

    return (
      <RectButton
        onPress={this._handlePress}
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
              onPress={this._handlePressJobUrl}
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

  _handlePress = () => {
    WebBrowser.openBrowserAsync(this.props.item.url);
  };

  _handlePressJobUrl = () => {
    WebBrowser.openBrowserAsync(this.props.item.jobUrl);
  };
}

class Sponsors extends React.Component {
  static navigationOptions = {
    title: 'Sponsors',
  };

  constructor(props) {
    super(props);

    const event = this.props.event;
    const SponsorsData = event.sponsors;

    this.SponsorsByLevel = [
      {title: 'Diamond', data: SponsorsData['diamond']},
      {title: 'Platinum', data: SponsorsData['platinum']},
      {title: 'Gold', data: SponsorsData['gold']},
      {title: 'Partners', data: SponsorsData['partner']},
    ];
  }

  render() {
    return (
      <LoadingPlaceholder>
        <SectionList
          renderScrollComponent={props => <ScrollView {...props} />}
          stickySectionHeadersEnabled={true}
          sections={this.SponsorsByLevel}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={4}
        />
      </LoadingPlaceholder>
    );
  }

  _renderSectionHeader = ({section}) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText>{section.title}</RegularText>
      </View>
    );
  };

  _renderItem = ({item}) => {
    return <SponsorRow item={item} />;
  };
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
