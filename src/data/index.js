import _ from 'lodash';
import moment from 'moment-timezone';

export function findNextTalksAfterDate(event, date = new Date()) {
  let flattenedTalks = event.groupedSchedule.reduce((result, group) => {
    result = [...result, ...group.slots];
    return result;
  }, []);

  let talks = _.filter(
    flattenedTalks,
    talk =>
      (talk.type === 0 || talk.type === 1) &&
      true
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
