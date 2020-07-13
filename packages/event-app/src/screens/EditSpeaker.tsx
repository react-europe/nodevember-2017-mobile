import {gql} from 'apollo-boost';
import React, {useEffect, useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView, Picker} from 'react-native';
import {TextInput, Title, ActivityIndicator} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {AdminSpeaker} from '../typings/data';
import {MenuTabProps} from '../typings/navigation';
import client from '../utils/gqlClient';

const GET_SPEAKERS_INFO = gql`
  query AdminSpeakerInfo($id: Int!, $token: String!, $speakerId: Int!) {
    adminEvents(id: $id, token: $token) {
      adminSpeakers(speakerId: $speakerId) {
        id
        name
        twitter
        github
        email
        shortBio
        bio
        status
      }
    }
  }
`;

const UPDATE_SPEAKER = gql`
  mutation updateSpeaker(
    $id: Int!
    $token: String!
    $email: String!
    $github: String!
    $name: String!
    $twitter: String!
    $bio: String!
    $status: Int!
  ) {
    updateSpeaker(
      id: $id
      token: $token
      email: $email
      github: $github
      name: $name
      twitter: $twitter
      bio: $bio
      status: $status
    ) {
      name
      twitter
      github
      email
      shortBio
      bio
      status
    }
  }
`;

export default function EditSpeaker(props: MenuTabProps<'EditSpeaker'>) {
  const [adminToken, setAdminToken] = useRecoilState(adminTokenState);
  const {event} = useContext(DataContext);
  const {control, handleSubmit, errors} = useForm();
  const [speaker, setSpeaker] = useState<AdminSpeaker | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(0);
  const {route, navigation} = props;

  async function fetchSpeakerInfo() {
    try {
      const result = await client.mutate({
        mutation: GET_SPEAKERS_INFO,
        variables: {
          id: event?.id,
          token: adminToken?.token,
          speakerId: route.params.speakerId,
        },
      });
      setSpeaker(result.data.adminEvents.adminSpeakers[0]);
      setStatus(result.data.adminEvents.adminSpeakers[0].status);
    } catch (e) {
      console.log('Error: ', e);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!adminToken?.token || !event?.id) return;
    fetchSpeakerInfo();
  }, [adminToken, event]);

  async function onSubmit(data: any) {
    setLoading(true);
    try {
      await client.mutate({
        mutation: UPDATE_SPEAKER,
        variables: {
          id: route.params.speakerId,
          token: adminToken?.token,
          name: data.name,
          twitter: data.twitter,
          github: data.github,
          email: data.email,
          shortBio: data.shortBio,
          bio: data.bio,
          status,
        },
      });
      navigation.navigate('Speakers');
    } catch (e) {
      console.log('ERROR: ', e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>{speaker?.name}</Title>
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="name"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            autoCompleteType="name"
            textContentType="name"
          />
        )}
        name="name"
        defaultValue={speaker?.name}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="twitter"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="twitter"
        defaultValue={speaker?.twitter}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="github"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="github"
        defaultValue={speaker?.github}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="email"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        )}
        name="email"
        defaultValue={speaker?.email}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Short bio"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            multiline
          />
        )}
        name="shortBio"
        defaultValue={speaker?.shortBio}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Bio"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            multiline
          />
        )}
        name="bio"
        defaultValue={speaker?.bio}
      />
      <Picker
        style={{paddingVertical: 20}}
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}>
        <Picker.Item label="Unconfirmed" value={0} />
        <Picker.Item label="Confirmed" value={1} />
        <Picker.Item label="Rejected" value={2} />
      </Picker>
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
  title: {
    paddingVertical: 20,
    alignSelf: 'center',
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
