import moment from "moment-timezone";
import _ from "lodash";
export const Schedule = require("../data/schedule.json");
const Event = Schedule.events[0];

export function getSpeakerTalk(speaker) {
  const talk = _.find(speaker.talks, function(talk) {
    return talk.type === 0;
  });
  if (!talk) {
    return speaker.talks[0];
  }
  return talk;
}

export function convertUtcDateToEventTimezone(date) {
  let d = new Date(date);
  return moment.tz(d, Event.timezoneId);
}

export function convertUtcDateToEventTimezoneHour(date) {
  let d = new Date(date);
  return moment.tz(d, Event.timezoneId).format("hh:mma");
}

export function convertUtcDateToEventTimezoneDaytime(date) {
  let d = new Date(date);
  return moment.tz(d, Event.timezoneId).format("dddd DD MMM, h:mma");
}

export function conferenceHasStarted() {
  return Event.status.hasStarted;
}

export function conferenceHasEnded() {
  return Event.status.hasEnded;
}

export function HideWhenConferenceHasStarted({ children }) {
  if (conferenceHasStarted()) {
    return null;
  } else {
    return children;
  }
}

export function HideWhenConferenceHasEnded({ children }) {
  if (conferenceHasEnded()) {
    return null;
  } else {
    return children;
  }
}

export function ShowWhenConferenceHasEnded({ children }) {
  if (conferenceHasEnded()) {
    return children;
  } else {
    return null;
  }
}
