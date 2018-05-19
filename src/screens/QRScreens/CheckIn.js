import React from 'react';
import { Alert, AsyncStorage } from 'react-native';
import { query } from 'urql';
import client from '../../utils/gqlClient';
import QRScreen from './QRScreen';

const qrCheckinQuery = `
mutation createCheckin($uuid: String!, $checkinListId: Int!, $ref: String!) {
  createCheckin(uuid: $uuid, checkinListId: $checkinListId, ref: $ref) {
    firstName
    lastName
    id
    type
    ref
    ticket {
      id
      name
    }
    email
    checkinMessage
    checkins {
      checkinListId
      createdAt
      id
    }
  }
}
`;

export default class QRCheckinScannerModalNavigation extends React.Component {
  state = {
    checkinList: { name: '' },
    checkRef: true,
    uuid: null,
    loading: false,
  };

  constructor(props) {
    super(props);
    AsyncStorage.removeItem('@MySuperStore:lastCheckedInRef');
  }

  _delay = async time => {
    return new Promise(function(resolve) {
      setTimeout(() => resolve(), time);
    });
  };

  componentDidMount() {
    const params = this.props.navigation.state.params || {};
    const checkinList = params.checkinList;
    const uuid = params.uuid;
    console.log('uuid is', uuid);
    console.log('checkinList is', checkinList);
    this.setState({
      uuid: uuid,
      checkinList: checkinList,
    });
  }

  _handleCheckinBarCodeRead = async data => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      let lastCheckedInRef = await AsyncStorage.getItem(
        '@MySuperStore:lastCheckedInRef'
      );
      await AsyncStorage.setItem('@MySuperStore:lastCheckedInRef', data.data);

      if (data.data === lastCheckedInRef) {
        // bail out
        return;
      }

      //{ slug: GQL.slug, uuid: data.data };
      let variables = {
        uuid: this.state.uuid,
        checkinListId: this.state.checkinList.id,
        ref: data.data,
      };

      //console.log("Scanned!", data.data);
      //console.log("variables", variables);
      //console.log("uuid state is", this.state.uuid);
      //console.log("checkinlist state is", this.state.checkinList);

      console.log('showQRSCanner', this.state.showQRScanner);
      let value = await client.executeQuery(
        query(qrCheckinQuery, variables),
        true
      );
      console.log('checkin mutation value', value);
      if (value && value.data && value.data.createCheckin === null) {
        Alert.alert(
          'This reference could not be found, make sure you selected the right Checkin List!'
        );
      } else if (value && value.data && value.data.createCheckin) {
        if (
          value.data.createCheckin.checkinMessage === 'Already checked-in today'
        ) {
          Alert.alert(
            'This reference has already been checked today! The person cannot get in as their ticket has already been used by someone else.'
          );
        }
        this.props.navigation.navigate('CheckedInAttendeeInfo', {
          checkedInAttendee: value.data.createCheckin,
        });
      }
      // expected output: Array [1, 2, 3]
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <QRScreen
        loading={this.state.loading}
        title={`Checking ${this.state.checkinList.name}`}
        onBarCodeRead={this._handleCheckinBarCodeRead}
      />
    );
  }
}
