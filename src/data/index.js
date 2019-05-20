import _ from 'lodash';
import moment from 'moment-timezone';
import {convertUtcDateToEventTimezone} from '../utils';

export function findNextTalksAfterDate(event) {
  let flattenedTalks = event.groupedSchedule.reduce((result, group) => {
    result = [...result, ...group.slots];
    return result;
  }, []);

  let currentTime = moment.tz(event.timezoneId);
  // You can test going into the future with:
  // let currentTime = moment.tz(event.timezoneId).add(4, 'days');

  let talks = _.filter(
    flattenedTalks,
    talk =>
      (talk.type === 0 || talk.type === 1 || talk.type === 8) &&
      currentTime.isBefore(convertUtcDateToEventTimezone(talk.startDate))
  );
  return talks.slice(0, 3);
}

export function findRandomTalk() {
  let talks = _.filter(Talks, talk => talk.type === 0);
  return [_.sample(talks)];
}

export function findTalkData(speakerName) {
  return _.find(Talks, talk => talk.speaker === speakerName);
}
