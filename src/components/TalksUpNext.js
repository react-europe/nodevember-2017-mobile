import React from 'react';
import {StyleSheet, View} from 'react-native';

import {RegularText, SemiBoldText} from './StyledText';
import TalkCard from './TalkCard';
import {Colors, FontSizes} from '../constants';
import {findRandomTalk, findNextTalksAfterDate} from '../data';
import _ from 'lodash';
import {
  convertUtcDateToEventTimezoneDaytime,
  conferenceHasEnded,
} from '../utils';

export default class TalksUpNext extends React.Component {
  constructor(props) {
    super(props);

    let nextTalks =
      conferenceHasEnded() || findNextTalksAfterDate().length === 0
        ? findRandomTalk()
        : findNextTalksAfterDate();
    let dateTime;
    let time;
    if (nextTalks && nextTalks.length > 0 && !_.isUndefined(nextTalks[0])) {
      dateTime = nextTalks[0].startDate;
      time = nextTalks[0].startDate;
    }

    this.state = {
      nextTalks,
      dateTime,
      time,
    };
  }
  componentDidMount() {
    let q = `{
  events(slug: "reacteurope-2018") {
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
    let that = this;
    fetch('http://www.react-europe.org/gql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: q}),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res.data);
        if (
          res &&
          res.data &&
          res.data.events &&
          res.data.events[0] &&
          res.data.events[0].status &&
          res.data.events[0].status.nextFiveScheduledItems &&
          res.data.events[0].status.nextFiveScheduledItems.length > 0
        ) {
          let nextTalks = res.data.events[0].status.nextFiveScheduledItems;
          that.setState({
            nextTalks: nextTalks.slice(0, 3),
            dateTime:
              nextTalks && nextTalks.length ? nextTalks[0].startDate : '',
            time: nextTalks && nextTalks.length ? nextTalks[0].startDate : '',
          });
        } else {
          that.setState({nextTalks: []});
        }
      });
  }
  render() {
    const {nextTalks} = this.state;

    return (
      <View style={[{marginHorizontal: 10}, this.props.style]}>
        <SemiBoldText style={{fontSize: FontSizes.title}}>
          {conferenceHasEnded() ? 'A great talk from 2018' : 'Coming up next'}
        </SemiBoldText>
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

const styles = StyleSheet.create({
  time: {
    color: Colors.faint,
    fontSize: FontSizes.subtitle,
  },
});
