import {EventEmitter} from 'fbemitter';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {AsyncStorage} from 'react-native';

import {Talk} from '../data/data';

type Talks = {[key: string]: Talk};

interface withSaveStateProps {
  talk: Talk;
}

const _emitter = new EventEmitter();
const _savedTalksStorageKey = '@Nodevember:savedTalks';
let _savedTalks: Talks | undefined;

export const loadSavedTalksAsync = async () => {
  try {
    const result = await AsyncStorage.getItem(_savedTalksStorageKey);
    if (result) {
      _savedTalks = JSON.parse(result);
    }
  } catch (e) {
    console.warn(e);
  } finally {
    if (!_savedTalks) {
      _savedTalks = {};
    }
  }
};

export function getSavedStateForTalk(talk: Talk) {
  if (talk.title && _savedTalks) {
    const talkKey = _.snakeCase(talk.title);
    const active = _savedTalks[talkKey];
    return active;
  }
  return null;
}

// Returns the subscription, subscriber needs to remove subscription on unmount
export function subscribeToUpdates(talk: Talk, onUpdateFn: (t: Talk) => void) {
  if (talk.title) {
    const talkKey = _.snakeCase(talk.title);
    return _emitter.addListener('change', () => {
      if (_savedTalks) {
        const active = _savedTalks[talkKey];
        onUpdateFn(active);
      }
    });
  }
  return null;
}

export const toggleSaved = (talk: Talk) => {
  if (talk.title && _savedTalks) {
    const key = _.snakeCase(talk.title);
    const newSavedTalks = {
      ..._savedTalks,
      [key]: !_savedTalks[key],
    };
    _updateSavedTalks(newSavedTalks);
  }
  return null;
};

function _updateSavedTalks(savedTalks: Talks) {
  _savedTalks = savedTalks;
  _emitter.emit('change');
  _updateAsyncStorage();
}

function _updateAsyncStorage() {
  try {
    AsyncStorage.setItem(_savedTalksStorageKey, JSON.stringify(_savedTalks));
  } catch (e) {
    console.warn(e);
  }
}

export const withSaveState = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & withSaveStateProps> => ({
  talk,
  ...props
}: withSaveStateProps) => {
  const [saved, setSaved] = useState(getSavedStateForTalk(talk));

  useEffect(() => {
    const _subscription = subscribeToUpdates(talk, (save) => {
      if (save !== saved) {
        setSaved(save);
      }
    });
    return function unmount() {
      if (_subscription) {
        _subscription.remove();
      }
    };
  }, []);

  return <Component saved={saved} {...(props as P)} />;
};

export function saveNewContact(contact, navigation) {
  AsyncStorage.getItem('@MySuperStore2019:contacts').then((storedContacts) => {
    let contacts = null;
    let newContacts = [];
    let found = false;
    if (storedContacts === null && contact && contact.firstName) {
      contacts = [contact];
    } else {
      const existingContacts = JSON.parse(storedContacts) || [];
      console.log('how many existing contacts', existingContacts.length);
      existingContacts.map((existingContact) => {
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
    const stringifiedContacts = JSON.stringify(contacts);
    AsyncStorage.setItem('@MySuperStore2019:contacts', stringifiedContacts)
      //AsyncStorage.removeItem('@MySuperStore2019:tickets')
      .then(() => {
        navigation.navigate('Contacts');
      });
  });
}
