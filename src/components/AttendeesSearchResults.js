import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { ScrollView, RectButton } from 'react-native-gesture-handler';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import Highlighter from 'react-native-highlight-words';

import { BoldText, SemiBoldText, RegularText } from './StyledText';
import LoadingPlaceholder from './LoadingPlaceholder';
import GravatarImage from './GravatarImage';
import HighlightableText from './HighlightableText';

import { getContactTwitter } from '../utils';

class AttendeeSearchResultRow extends React.Component {
  render() {
    const { attendee, searchQuery } = this.props;
    return (
      <RectButton
        onPress={() => this.props.onPress(attendee)}
        activeOpacity={0.05}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <View style={styles.row}>
          <View style={styles.rowAvatarContainer}>
            <GravatarImage style={styles.avatarImage} email={attendee.email} />
          </View>
          <View style={styles.rowData}>
            <HighlightableText
              TextComponent={BoldText}
              highlightStyle={{ backgroundColor: '#e1e8ed' }}
              searchWords={[searchQuery]}
              textToHighlight={`${attendee.firstName} ${attendee.lastName}`}
            />
            {attendee.email ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                  name={'email'}
                  size={16}
                  color="#aab8c2"
                  style={{ paddingRight: 3 }}
                />
                <HighlightableText
                  TextComponent={SemiBoldText}
                  highlightStyle={{ backgroundColor: '#e1e8ed' }}
                  searchWords={[searchQuery]}
                  textToHighlight={attendee.email}
                />
              </View>
            ) : null}
            {getContactTwitter(attendee) ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo name={'twitter'} size={16} color="#1da1f2" style={{ paddingRight: 3 }} />
                <HighlightableText
                  TextComponent={RegularText}
                  highlightStyle={{ backgroundColor: '#e1e8ed' }}
                  searchWords={[searchQuery]}
                  textToHighlight={`@${getContactTwitter(attendee)}`}
                />
              </View>
            ) : null}
          </View>
        </View>
      </RectButton>
    );
  }
}

export default class AttendeeSearchResults extends React.Component {
  render() {
    return (
      <LoadingPlaceholder>
        <FlatList
          renderScrollComponent={props => <ScrollView {...props} />}
          renderItem={this._renderItem}
          data={this.props.attendees}
          keyExtractor={item => `${item.id}`}
          initialNumToRender={10}
          keyboardDismissMode="on-drag"
          style={styles.list}
        />
      </LoadingPlaceholder>
    );
  }

  _renderItem = ({ item: attendee }) => {
    return (
      <AttendeeSearchResultRow
        attendee={attendee}
        onPress={this.props.onPress}
        searchQuery={this.props.searchQuery}
      />
    );
  };

  _handlePressRow = attendee => {
    this.props.navigation.navigate('AttendeeDetail', { attendee });
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
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rowData: {
    flex: 1,
  },
  list: {
    marginTop: 80,
  }
});
