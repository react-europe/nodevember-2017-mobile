import * as WebBrowser from 'expo-web-browser';
import moment from 'moment-timezone';
import React from 'react';
import {Platform, Linking, AsyncStorage} from 'react-native';

import {GQL} from '../constants';
import {
  Speaker,
  Talk,
  Event as EventType,
  User,
  Attendee,
} from '../typings/data';

export function getSpeakerTalk(speaker: Speaker): Talk | undefined {
  let talk = undefined;
  if (speaker.talks) {
    talk = speaker?.talks.find((talk) => {
      if (talk) {
        return talk.type === 0;
      }
      return false;
    });
  }
  if (!talk) {
    if (speaker.talks && speaker.talks[0]) {
      return speaker.talks[0];
    }
    return undefined;
  }
  return talk;
}

let Event: EventType;

export function setEvent(event: EventType): void {
  Event = event;
}

export function convertUtcDateToEventTimezone(
  date?: string
): moment.Moment | null {
  let d;
  if (date) {
    d = new Date(date);
  } else {
    d = new Date();
  }
  if (Event.timezoneId) {
    return moment.tz(d, Event.timezoneId);
  }
  return null;
}

export function convertUtcDateToEventTimezoneHour(date: string): string | null {
  const d = new Date(date);
  if (Event.timezoneId) {
    return moment.tz(d, Event.timezoneId).format('hh:mma');
  }
  return null;
}

export function convertUtcDateToEventTimezoneDaytime(
  date: string
): string | null {
  const d = new Date(date);
  if (Event.timezoneId) {
    return moment.tz(d, Event.timezoneId).format('dddd DD MMM, h:mma');
  }
  return null;
}

export function conferenceHasStarted(): boolean | null {
  if (Event.status?.hasStarted) {
    return Event.status.hasStarted;
  }
  return null;
}

export function conferenceHasEnded(): boolean | null {
  if (Event?.status?.hasEnded) {
    return Event.status.hasEnded;
  }
  return null;
}

type Props = {
  children: React.ReactNode;
};

export function HideWhenConferenceHasStarted(props: Props) {
  if (conferenceHasStarted()) {
    return <></>;
  } else {
    return <>{props.children}</>;
  }
}

export function HideWhenConferenceHasEnded(props: Props) {
  if (conferenceHasEnded()) {
    return <></>;
  } else {
    return <>{props.children}</>;
  }
}

export function ShowWhenConferenceHasEnded(props: Props) {
  if (conferenceHasEnded()) {
    return <>{props.children}</>;
  } else {
    return <></>;
  }
}

export const sendEmail = (
  emailTo: string,
  fromName = {firstName: '', lastName: ''}
): void => {
  const emailurl =
    'mailto:' +
    emailTo +
    "?subject=hey it's" +
    ' ' +
    fromName.firstName +
    ' ' +
    fromName.lastName +
    ' ' +
    'from ReactEurope&body=ping';
  try {
    if (Platform.OS === 'android') {
      WebBrowser.openBrowserAsync(emailurl);
    } else {
      Linking.openURL(emailurl);
    }
  } catch (e) {
    WebBrowser.openBrowserAsync('mailto:' + emailTo);
  }
};

export const openTwitter = async (twitter: string): Promise<any> => {
  try {
    await Linking.openURL(`twitter://user?screen_name=` + twitter);
  } catch (e) {
    WebBrowser.openBrowserAsync('https://twitter.com/' + twitter);
  }
};

export const saveSchedule = async (schedule: EventType): Promise<void> => {
  return AsyncStorage.setItem(
    '@MySuperStore2019:schedule',
    JSON.stringify(schedule)
  );
};

export const getContactTwitter = (contact: User | Attendee): string => {
  let twitter = '';
  if (contact?.answers) {
    contact.answers.map((answer) => {
      if (
        answer?.question?.title &&
        answer.question.title === 'Twitter' &&
        answer.value
      ) {
        twitter = answer.value;
      }
    });
  }
  return twitter
    .replace('@', '')
    .replace('https://twitter.com/', '')
    .replace('twitter.com/', '');
};

export async function getTickets() {
  try {
    const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
    if (value) {
      const tickets: User[] = JSON.parse(value);
      return tickets;
    }
  } catch (err) {
    console.log(err);
  }
  return [];
}

export async function updateTickets(tickets: string) {
  try {
    await AsyncStorage.setItem('@MySuperStore2019:tickets', tickets);
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getContacts() {
  try {
    const value = await AsyncStorage.getItem('@MySuperStore2019:contacts');
    if (value) {
      const contacts: Attendee[] = JSON.parse(value);
      return contacts;
    }
  } catch (err) {
    console.log(err);
  }
  return [];
}

export function getMainEventTicket(tickets: User[]) {
  for (const ticket of tickets) {
    if (!ticket.checkinLists) continue;
    for (const checkIn of ticket.checkinLists) {
      if (checkIn?.mainEvent === true) {
        return ticket;
      }
    }
  }
  return null;
}

export function checkSharingInfo(tickets: User[] | null) {
  if (!tickets) return false;
  const mainTicket = getMainEventTicket(tickets);
  if (mainTicket) {
    return mainTicket.shareInfo ? mainTicket?.shareInfo : false;
  }
  return false;
}

export function getUuid(tickets: User[] | null) {
  if (!tickets) return '';
  const mainTicket = getMainEventTicket(tickets);
  if (mainTicket) {
    return mainTicket.uuid ? mainTicket.uuid : '';
  }
  return '';
}

export function displayNextEdition(event: EventType) {
  if (!event.slug) return false;
  if (event.slug !== GQL.slug) {
    return true;
  }
  return false;
}

export async function getValueFromStore(key: string) {
  try {
    const value = await AsyncStorage.getItem('@MySuperStore2019:' + key);
    if (value) {
      const parsedValue: any = JSON.parse(value);
      return parsedValue;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

export async function getEdition() {
  const edition = await getValueFromStore('edition');
  if (!edition) {
    return GQL.slug;
  }
  return edition;
}
