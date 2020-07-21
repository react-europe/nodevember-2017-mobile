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

const ADMIN_MAIN_EVENT = gql`
  query AdminMainEvent($id: Int!, $token: String!) {
    adminEvents(id: $id, token: $token) {
      name
      tagLine
      organizers
      description
      startDate
      endDate
      cocUrl
      organizerEmail
    }
  }
`;
const UPDATE_MAIN_EVENT = gql`
  mutation(
    $id: Int!
    $token: String!
    $name: String!
    $tagLine: String!
    $organizers: String!
    $description: String!
    $cocUrl: String!
    $organizerEmail: String!
  ) {
    updateEvent(
      id: $id
      token: $token
      name: $name
      tagLine: $tagLine
      organizers: $organizers
      description: $description
      cocUrl: $cocUrl
      organizerEmail: $organizerEmail
    ) {
      name
      tagLine
      organizers
      description
      startDate
      endDate
      cocUrl
      organizerEmail
    }
  }
`;

export default function Main() {
  const adminToken = useRecoilValue(adminTokenState);
  const [mainEvent, setMainEvent] = useState<Event | null>();
  const {event} = useContext(DataContext);
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(true);

  async function fetchSpeakerInfo() {
    try {
      const result = await client.query({
        query: ADMIN_MAIN_EVENT,
        fetchPolicy: 'network-only',
        variables: {
          id: event?.id,
          token: adminToken?.token,
        },
      });
      setMainEvent(result.data.adminEvents);
    } catch (e) {
      Alert.alert('Unable to fetch', JSON.stringify(e));
    }
    setLoading(false);
  }

  async function onSubmit(data: any) {
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: UPDATE_MAIN_EVENT,
        variables: {
          id: event?.id,
          token: adminToken?.token,
          name: data.name,
          tagLine: data.tagLine,
          organizers: data.organizers,
          description: data.description,
          cocUrl: data.cocUrl,
          organizerEmail: data.organizerEmail,
        },
      });
      setMainEvent(result.data.updateEvent);
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
            label="Name"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
          />
        )}
        name="name"
        defaultValue={mainEvent?.name}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Tag line"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="tagLine"
        defaultValue={mainEvent?.tagLine}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Organizers"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="organizers"
        defaultValue={mainEvent?.organizers}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Description"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="description"
        defaultValue={mainEvent?.description}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="cocUrl"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
          />
        )}
        name="cocUrl"
        defaultValue={mainEvent?.cocUrl}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Organizer email"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        )}
        name="organizerEmail"
        defaultValue={mainEvent?.organizerEmail}
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
