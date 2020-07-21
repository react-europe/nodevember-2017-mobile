import {gql} from 'apollo-boost';
import React, {useContext, useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {StyleSheet, Alert, ScrollView, View} from 'react-native';
import {TextInput, ActivityIndicator} from 'react-native-paper';
import {useRecoilValue} from 'recoil';

import PrimaryButton from '../../components/PrimaryButton';
import {SemiBoldText} from '../../components/StyledText';
import DataContext from '../../context/DataContext';
import {adminTokenState} from '../../context/adminTokenState';
import {Event} from '../../typings/data';
import client from '../../utils/gqlClient';

const ADMIN_EVENT_DETAILS = gql`
  query AdminMainEvent($id: Int!, $token: String!) {
    adminEvents(id: $id, token: $token) {
      customDomain
      sponsorPdfUrl
      speakersLegend
      scheduleLegend
      ticketsLegend
      gettingThereLegend
      copyrightsLegend
      hotelsList
    }
  }
`;
const UPDATE_EVENT_DETAILS = gql`
  mutation(
    $id: Int!
    $token: String!
    $customDomain: String!
    $sponsorPdfUrl: String!
    $speakersLegend: String!
    $scheduleLegend: String!
    $ticketsLegend: String!
    $gettingThereLegend: String!
    $copyrightsLegend: String!
    $hotelsList: String!
  ) {
    updateEvent(
      id: $id
      token: $token
      customDomain: $customDomain
      sponsorPdfUrl: $sponsorPdfUrl
      speakersLegend: $speakersLegend
      scheduleLegend: $scheduleLegend
      ticketsLegend: $ticketsLegend
      gettingThereLegend: $gettingThereLegend
      copyrightsLegend: $copyrightsLegend
      hotelsList: $hotelsList
    ) {
      customDomain
      sponsorPdfUrl
      speakersLegend
      scheduleLegend
      ticketsLegend
      gettingThereLegend
      copyrightsLegend
      hotelsList
    }
  }
`;

export default function Main() {
  const adminToken = useRecoilValue(adminTokenState);
  const [eventDetails, setEventDetails] = useState<Event | null>();
  const {event} = useContext(DataContext);
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(true);

  async function fetchSpeakerInfo() {
    try {
      const result = await client.query({
        query: ADMIN_EVENT_DETAILS,
        fetchPolicy: 'network-only',
        variables: {
          id: event?.id,
          token: adminToken?.token,
        },
      });
      console.log('RESULT: ', result.data.adminEvents);
      setEventDetails(result.data.adminEvents);
    } catch (e) {
      Alert.alert('Unable to fetch', JSON.stringify(e));
    }
    setLoading(false);
  }

  async function onSubmit(data: any) {
    console.log(data);
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: UPDATE_EVENT_DETAILS,
        variables: {
          id: event?.id,
          token: adminToken?.token,
          ...data,
        },
      });
      setEventDetails(result.data.updateEvent);
    } catch (e) {
      Alert.alert('Update failed', JSON.stringify(e));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!adminToken?.token || !event?.id) return;
    fetchSpeakerInfo();
  }, [adminToken, event]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Custom domain"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="URL"
            keyboardType="url"
          />
        )}
        name="customDomain"
        defaultValue={eventDetails?.customDomain}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Sponsor Pdf Url"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="URL"
            keyboardType="url"
          />
        )}
        name="sponsorPdfUrl"
        defaultValue={eventDetails?.sponsorPdfUrl}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Speakers Legend"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="speakersLegend"
        defaultValue={eventDetails?.speakersLegend}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Schedule Legend"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="scheduleLegend"
        defaultValue={eventDetails?.scheduleLegend}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Tickets legend"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="ticketsLegend"
        defaultValue={eventDetails?.ticketsLegend}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Getting there legend"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="gettingThereLegend"
        defaultValue={eventDetails?.gettingThereLegend}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Copyrights legend"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="copyrightsLegend"
        defaultValue={eventDetails?.copyrightsLegend}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Hotels list"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="hotelsList"
        defaultValue={eventDetails?.hotelsList}
      />
      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={handleSubmit(onSubmit)}>
          <SemiBoldText fontSize="md" TextColorAccent>
            Update
          </SemiBoldText>
        </PrimaryButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  input: {
    marginVertical: 5,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
