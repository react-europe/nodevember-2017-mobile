import React from 'react';
import {AsyncStorage} from 'react-native';
import {EventEmitter} from 'fbemitter';
import _ from 'lodash';

const _emitter = new EventEmitter();
const _savedTalksStorageKey = '@Nodevember:savedTalks';
let _savedTalks;

export const loadSavedTalksAsync = async () => {
  try {
    let result = await AsyncStorage.getItem(_savedTalksStorageKey);
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

export function getSavedStateForTalk(talk) {
  const talkKey = _.snakeCase(talk.title);
  const active = _savedTalks[talkKey];
  return active;
}

// Returns the subscription, subscriber needs to remove subscription on unmount
export function subscribeToUpdates(talk, onUpdateFn) {
  const talkKey = _.snakeCase(talk.title);
  return _emitter.addListener('change', () => {
    const active = _savedTalks[talkKey];
    onUpdateFn(active);
  });
}

export const toggleSaved = talk => {
  let key = _.snakeCase(talk.title);
  let newSavedTalks = {
    ..._savedTalks,
    [key]: !_savedTalks[key],
  };

  _updateSavedTalks(newSavedTalks);
};

function _updateSavedTalks(savedTalks) {
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

export function withSaveState(WrappedComponent) {
  class ComponentWithSaveState extends React.Component {
    state = {
      saved: getSavedStateForTalk(this.props.talk),
    };

    componentWillMount() {
      this._subscription = subscribeToUpdates(this.props.talk, saved => {
        if (saved !== this.state.saved) {
          this.setState({saved});
        }
      });
    }

    componentWillUnmount() {
      this._subscription.remove();
    }

    render() {
      return <WrappedComponent saved={this.state.saved} {...this.props} />;
    }
  }

  return ComponentWithSaveState;
}

export function saveNewContact(contact, navigation) {
  AsyncStorage.getItem('@MySuperStore2019:contacts').then(storedContacts => {
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
    AsyncStorage.setItem('@MySuperStore2019:contacts', stringifiedContacts)
      //AsyncStorage.removeItem('@MySuperStore2019:tickets')
      .then(() => {
        navigation.navigate('Contacts');
      });
  });
}
