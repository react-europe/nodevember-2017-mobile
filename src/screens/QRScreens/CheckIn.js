import React, {useEffect, useState} from 'react';
import {Alert, AsyncStorage} from 'react-native';
import client from '../../utils/gqlClient';
import QRScreen from './QRScreen';
import QR_CHECKIN_QUERY from '../../data/qrCheckinQuery';

export default function QRCheckinScannerModalNavigation(props) {
  const [loading, setLoading] = useState(false);
  const params = props.route.params;

  useEffect(() => {
    AsyncStorage.removeItem('@MySuperStore2019:lastCheckedInRef');
  }, []);

  const _handleCheckinBarCodeRead = async data => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      let lastCheckedInRef = await AsyncStorage.getItem(
        '@MySuperStore2019:lastCheckedInRef'
      );
      await AsyncStorage.setItem(
        '@MySuperStore2019:lastCheckedInRef',
        data.data
      );

      if (data.data === lastCheckedInRef) {
        // bail out
        return;
      }

      //{ slug: GQL.slug, uuid: data.data };
      let variables = {
        uuid: params.uuid,
        checkinListId: params.checkinList.id,
        ref: data.data,
      };

      //console.log("Scanned!", data.data);
      //console.log("variables", variables);
      //console.log("uuid state is", this.state.uuid);
      //console.log("checkinlist state is", this.state.checkinList);

      let value = await client.mutate({
        mutation: QR_CHECKIN_QUERY,
        variables: variables,
      });

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
        props.navigation.navigate('CheckedInAttendeeInfo', {
          checkedInAttendee: value.data.createCheckin,
        });
      }
      // expected output: Array [1, 2, 3]
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <QRScreen
      loading={loading}
      title={`Checking ${params.checkinList}`}
      onBarCodeScanned={_handleCheckinBarCodeRead}
    />
  );
}
