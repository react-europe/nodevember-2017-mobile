import React from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import {Platform, Linking} from 'react-native';
import {WebBrowser} from 'expo';
import {AsyncStorage} from 'react-native';

export function getSpeakerTalk(speaker) {
  const talk = _.find(speaker.talks, function(talk) {
    return talk.type === 0;
  });
  if (!talk) {
    return speaker.talks[0];
  }
  return talk;
}

let Event;

export function setEvent(event) {
  Event = event;
}

export function convertUtcDateToEventTimezone(date) {
  let d = new Date(date);
  return moment.tz(d, Event.timezoneId);
}

export function convertUtcDateToEventTimezoneHour(date) {
  let d = new Date(date);
  return moment.tz(d, Event.timezoneId).format('hh:mma');
}

export function convertUtcDateToEventTimezoneDaytime(date) {
  let d = new Date(date);
  return moment.tz(d, Event.timezoneId).format('dddd DD MMM, h:mma');
}

export function conferenceHasStarted() {
  return Event.status.hasStarted;
}

export function conferenceHasEnded() {
  return Event.status.hasEnded;
}

export function HideWhenConferenceHasStarted({children}) {
  if (conferenceHasStarted()) {
    return null;
  } else {
    return children;
  }
}

export function HideWhenConferenceHasEnded({children}) {
  if (conferenceHasEnded()) {
    return null;
  } else {
    return children;
  }
}

export function ShowWhenConferenceHasEnded({children}) {
  if (conferenceHasEnded()) {
    return children;
  } else {
    return null;
  }
}

export const sendEmail = (
  emailTo,
  fromName = {firstName: '', lastName: ''}
) => {
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
    Platform.OS === 'android'
      ? WebBrowser.openBrowserAsync(emailurl)
      : Linking.openURL(emailurl);
  } catch (e) {
    WebBrowser.openBrowserAsync('mailto:' + emailTo);
  }
};

export const openTwitter = async twitter => {
  try {
    await Linking.openURL(`twitter://user?screen_name=` + twitter);
  } catch (e) {
    WebBrowser.openBrowserAsync('https://twitter.com/' + twitter);
  }
};

export const addContact = async contact => {
  const storedContacts = await AsyncStorage.getItem('@MySuperStore:contacts');

  let contacts = null;
  let newContacts = [];
  let found = false;
  if (storedContacts === null && contact && contact.firstName) {
    contacts = [contact];
  } else {
    let existingContacts = JSON.parse(storedContacts) || [];
    console.log('how many existing contacts', existingContacts.length);
    existingContacts.map(existingContact => {
      console.log('existing contact', existingContact);
      if (
        existingContact &&
        existingContact.id &&
        contact &&
        contact.id &&
        existingContact.id === contact.id
      ) {
        found = true;
        newContacts.push(contact);
      } else if (existingContact && existingContact.id) {
        newContacts.push(existingContact);
      }
    });
    if (!found && contact && contact.id) {
      newContacts.push(contact);
    }
    contacts = newContacts;
  }
  if (contacts === [null]) {
    contacts = [];
  }
  let stringifiedContacts = JSON.stringify(contacts);
  return AsyncStorage.setItem('@MySuperStore:contacts', stringifiedContacts);
};

export const saveSchedule = async schedule => {
  return AsyncStorage.setItem(
    '@MySuperStore:schedule',
    JSON.stringify(schedule)
  );
};

export const getContactTwitter = contact => {
  let twitter = '';
  if (contact) {
    contact.answers.map(answer => {
      if (answer.question && answer.question.title === 'Twitter') {
        twitter = answer.value;
      }
    });
  }
  return twitter
    .replace('@', '')
    .replace('https://twitter.com/', '')
    .replace('twitter.com/', '');
};
