import _ from 'lodash';

export const Schedule = require('../data/schedule.json');

const Event = Schedule.events[0];
export const Talks = Schedule.events[0].schedule;

export function findNextTalksAfterDate() {
  let talks = Event.status.nextFiveScheduledItems;
  return talks.slice(0, 3);
}

export function findRandomTalk() {
  let talks = _.filter(Talks, talk => talk.type === 0);
  return [_.sample(talks)];
}

export function findTalkData(speakerName) {
  return _.find(Talks, talk => talk.speaker === speakerName);
}
