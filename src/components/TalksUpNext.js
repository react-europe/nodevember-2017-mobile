import React from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {GQL} from '../constants';
import NEXT_SCHEDULE_ITEMS from '../data/NextScheduleItems';
import client from '../utils/gqlClient';
import {RegularText, SemiBoldText} from './StyledText';
import TalkCard from './TalkCard';
import {Colors, FontSizes} from '../constants';
import {findRandomTalk, findNextTalksAfterDate} from '../data';
import _ from 'lodash';
import {withNavigation} from 'react-navigation';
import {
  convertUtcDateToEventTimezoneDaytime,
  conferenceHasEnded,
} from '../utils';

@withNavigation
export default class TalksUpNext extends React.Component {
  state = {
    nextTalks: [],
    dateTime: null,
    time: null,
    fetching: false,
  };

  componentDidMount() {
    this._fetchTalksAsync();
    this.props.navigation.addListener('didFocus', () => {
      this._fetchTalksAsync();
    });
  }

  _fetchTalksAsync = async () => {
    if (this.state.fetching) {
      return;
    }

    this.setState({fetching: true});
    try {
      let res = await client.query({
        query: NEXT_SCHEDULE_ITEMS,
        variables: {slug: GQL.slug},
        fetchPolicy: 'network-only',
      });
      if (res?.data?.events?.[0]?.status?.nextFiveScheduledItems?.length > 0) {
        let nextTalks = res.data.events[0].status.nextFiveScheduledItems;
        this.setState({
          nextTalks: nextTalks.slice(0, 3),
          dateTime: nextTalks && nextTalks.length ? nextTalks[0].startDate : '',
          time: nextTalks && nextTalks.length ? nextTalks[0].startDate : '',
        });
      } else {
        // set error state?
      }
    } catch (e) {
      // uh oh
    } finally {
      this.setState({fetching: false});
    }
  };

  render() {
    const {nextTalks} = this.state;

    return (
      <View style={[{marginHorizontal: 10 }, this.props.style]}>
        <View style={{flexDirection: 'row'}}>
          <SemiBoldText style={{fontSize: FontSizes.title}}>
            {conferenceHasEnded() ? 'A great talk from 2019' : 'Coming up next'}
          </SemiBoldText>
          {this._maybeRenderActivityIndicator()}
        </View>
        {this._renderDateTime()}
        {nextTalks.map(talk => (
          <TalkCard
            key={talk.title}
            talk={talk}
            style={{marginTop: 10, marginBottom: 10}}
          />
        ))}
      </View>
    );
  }

  _maybeRenderActivityIndicator = () => {
    if (this.state.fetching) {
      return (
        <View style={{marginLeft: 8, marginTop: 3}}>
          <ActivityIndicator color={Platform.OS === 'android' ? Colors.blue : '#888'} />
        </View>
      );
    }
  };

  _renderDateTime() {
    if (conferenceHasEnded()) {
      return null;
    }

    const {dateTime} = this.state;

    if (dateTime) {
      return (
        <RegularText style={styles.time}>
          {convertUtcDateToEventTimezoneDaytime(dateTime)}
        </RegularText>
      );
    } else {
      // handle after conf thing
    }
  }
}

const q =
  `{
  events(slug: "` +
  GQL.slug +
  `") {
    id
    status {
      hasEnded
      hasStarted
      onGoing
      nextFiveScheduledItems {
        id
        title
        description
        startDate
        speakers {
          id
          name
          twitter
          avatarUrl
          bio
          talks {
            id
            description
            title
            startDate
          }
        }
      }
    }
  }
}
`;

const styles = StyleSheet.create({
  time: {
    color: Colors.faint,
    fontSize: FontSizes.subtitle,
  },
});
