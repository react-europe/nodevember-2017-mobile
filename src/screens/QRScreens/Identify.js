import React from 'react';
import {Alert, AsyncStorage} from 'react-native';
import {Permissions, Notifications} from 'expo';
import QRScreen from './QRScreen';
import {query} from 'urql';
import {GQL} from '../../constants';

import client from '../../utils/gqlClient';

const qrQuery = `
query events($slug: String!, $uuid: String!){
  events(slug: $slug) {
	me(uuid: $uuid){
      mobileMessage
	  answers {
		id
        value
        question {
          id
		  title
        }
	  }
	  firstName
	  lastName
	  email
	  ref
	  shareInfo
      uuid
      id
      type
      canCheckin
staffCheckinLists {
    id
    name
    mainEvent
}
checkinLists {
        id
        name
        mainEvent
      }
	}
  }
}
`;

const updatePushTokenQuery = `
mutation updateAttendee($uuid: String!, $expoPushToken: String!) {
  updateAttendee(uuid: $uuid, expoPushToken: $expoPushToken) {
    firstName
    lastName
    id
    email
    canCheckin
  }
}
`;

export default class QRScannerModalNavigation extends React.Component {
  state = {
    loading: false,
  };
  async setTickets(tickets) {
    try {
      await AsyncStorage.setItem('@MySuperStore:tickets', tickets);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async registerForPushNotificationsAsync(uuid) {
    const {status: existingStatus} = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    const variables = {uuid: uuid, expoPushToken: token};
    client
      .executeQuery(query(updatePushTokenQuery, variables), true)
      .then(function(value) {
        console.log('updated attendee', value, token, uuid);
      });
    console.log('token', token, uuid);
  }

  constructor(props) {
    super(props);
    console.log('navigation props params', this.props.navigation.state.params);
    if (
      this &&
      this.props &&
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.uuid &&
      this.props.navigation.state.params.uuid !== ''
    ) {
      this._handleBarCodeRead({data: this.props.navigation.state.params.uuid});
    }
  }

  _handleBarCodeRead = async data => {
    if (this.state.loading) {
      return;
    }

    this.setState({loading: true});

    if (!data || !data.data || data.data === '') {
      let data = {data: this.props.navigation.state.params.uuid};
    }
    let variables = {slug: GQL.slug, uuid: data.data};
    let navigation = this.props.navigation;
    try {
      let result = await client.executeQuery(query(qrQuery, variables), true);

      let me;
      if (
        result &&
        result.data &&
        result.data.events &&
        result.data.events[0]
      ) {
        me = result.data.events[0].me;
        if (me === null) {
          Alert.alert('Ticket not found!');
          return;
        }
      } else {
        Alert.alert('Oops, something went wrong!');
        return;
      }

      let value = await AsyncStorage.getItem('@MySuperStore:tickets');
      let tickets = null;
      let newTickets = [];
      let found = false;

      if (value === null && me !== null) {
        tickets = [me];
      } else {
        let existingTickets = JSON.parse(value) || [];
        existingTickets.map(ticket => {
          if (ticket && me && me.ref && ticket.ref === me.ref) {
            found = true;
            newTickets.push(me);
          } else {
            if (ticket) {
              newTickets.push(ticket);
            }
          }
        });
        if (!found && me) {
          newTickets.push(me);
        }
        tickets = newTickets;
        if (!tickets || tickets[0] === [null]) {
          tickets = [];
        }
      }

      if (tickets && tickets !== null && tickets !== []) {
        let stringifiedTickets = JSON.stringify(tickets);
        this.setTickets(stringifiedTickets);
        //AsyncStorage.setItem("@MySuperStore:tickets", stringifiedTickets)
        //AsyncStorage.removeItem('@MySuperStore:tickets')
        //.then(value => {
        this.registerForPushNotificationsAsync(variables.uuid);
        navigation.navigate('Profile');
        //});
      }
      // expected output: Array [1, 2, 3]
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  render() {
    if (
      this &&
      this.props &&
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.uuid &&
      this.props.navigation.state.params.uuid !== ''
    ) {
      return null;
    }
    return (
      <QRScreen
        title="Scan your ticket QR code"
        loading={this.state.loading}
        onBarCodeScanned={this._handleBarCodeRead}
      />
    );
  }
}
