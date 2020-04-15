import React, {useState} from 'react';
import {StyleSheet, View, InteractionManager} from 'react-native';
import {RegularText, SemiBoldText} from './StyledText';
import TalkCard from './TalkCard';
import {Colors, FontSizes} from '../constants';
import {findNextTalksAfterDate} from '../data';
import {
  convertUtcDateToEventTimezoneDaytime,
  conferenceHasEnded,
} from '../utils';

function TalksUpNext(props) {
  const [dateTime, setDateTime] = useState(null);
  const [nextTalks, setNextTalks] = useState([]);

  useState(() => {
    InteractionManager.runAfterInteractions(() => {
      _fetchTalks();
    });
  });

  function _fetchTalks() {
    let nextTalksData = findNextTalksAfterDate(props.event);
    if (nextTalksData) {
      setNextTalks(nextTalksData.slice(0, 3));
      setDateTime(nextTalksData.length ? nextTalksData[0].startDate : '');
    }
  }

  function _renderDateTime() {
    if (conferenceHasEnded()) {
      return null;
    }
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

  return (
    <View style={[{marginHorizontal: 10}, props.style]}>
      <View style={{flexDirection: 'row'}}>
        <SemiBoldText style={{fontSize: FontSizes.title}}>
          {conferenceHasEnded() ? 'A great talk from 2019' : 'Coming up next'}
        </SemiBoldText>
      </View>
      {_renderDateTime()}
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

export default TalksUpNext;

const styles = StyleSheet.create({
  time: {
    color: Colors.faint,
    fontSize: FontSizes.subtitle,
  },
});
