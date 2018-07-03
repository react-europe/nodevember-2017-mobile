import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import {ScrollView, RectButton} from 'react-native-gesture-handler';
import {getSpeakerTalk} from '../utils';

import {Colors} from '../constants';
import MenuButton from '../components/MenuButton';
import CachedImage from '../components/CachedImage';
import {BoldText, SemiBoldText, RegularText} from '../components/StyledText';
import LoadingPlaceholder from '../components/LoadingPlaceholder';

class SpeakerRow extends React.Component {
  render() {
    const {item: speaker} = this.props;

    return (
      <RectButton
        onPress={this._handlePress}
        activeOpacity={0.05}
        style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.row}>
          <View style={styles.rowAvatarContainer}>
            <FadeIn>
              <CachedImage
                source={{uri: speaker.avatarUrl}}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
            </FadeIn>
          </View>
          <View style={styles.rowData}>
            <BoldText>{speaker.name}</BoldText>
            {speaker.twitter ? (
              <SemiBoldText>@{speaker.twitter}</SemiBoldText>
            ) : null}
            {speaker.talks && speaker.talks.length > 0 ? (
              <RegularText>{getSpeakerTalk(speaker).title}</RegularText>
            ) : null}
          </View>
        </View>
      </RectButton>
    );
  }

  _handlePress = () => {
    this.props.onPress(this.props.item);
  };
}

export default class Speakers extends React.Component {
  static navigationOptions = {
    title: 'Speakers',
  };

  render() {
    return (
      <LoadingPlaceholder>
        <SectionList
          renderScrollComponent={props => <ScrollView {...props} />}
          stickySectionHeadersEnabled={true}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          sections={[
            {data: this.props.screenProps.event.speakers, title: 'Speakers'},
          ]}
          keyExtractor={(item, index) => index.toString()}
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
    return <SpeakerRow item={item} onPress={this._handlePressRow} />;
  };

  _handlePressRow = speaker => {
    this.props.navigation.navigate('Details', {speaker});
  };
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
