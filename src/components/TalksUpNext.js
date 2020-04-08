import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  InteractionManager,
} from 'react-native';
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

class TalksUpNext extends React.Component {
  state = {
    nextTalks: [],
    dateTime: null,
    time: null,
    fetching: false,
  };

  componentDidMount() {
    this._fetchTalks();
    InteractionManager.runAfterInteractions(() => {
      this._fetchTalks();
    });
  }

  _fetchTalks = () => {
    if (this.state.fetching) {
      return;
    }

    let nextTalks = findNextTalksAfterDate(this.props.event);
    if (nextTalks) {
      this.setState({
        nextTalks: nextTalks.slice(0, 3),
        dateTime: nextTalks && nextTalks.length ? nextTalks[0].startDate : '',
        time: nextTalks && nextTalks.length ? nextTalks[0].startDate : '',
      });
    }
  };

  render() {
    const {nextTalks} = this.state;

    return (
      <View style={[{marginHorizontal: 10}, this.props.style]}>
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
          <ActivityIndicator
            color={Platform.OS === 'android' ? Colors.blue : '#888'}
          />
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

export default withNavigation(TalksUpNext);

const styles = StyleSheet.create({
  time: {
    color: Colors.faint,
    fontSize: FontSizes.subtitle,
  },
});
