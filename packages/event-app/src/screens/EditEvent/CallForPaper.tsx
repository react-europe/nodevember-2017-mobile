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

const ADMIN_EVENT_CFP = gql`
  query AdminMainEvent($id: Int!, $token: String!) {
    adminEvents(id: $id, token: $token) {
      cfpRules
      cfpForceGithub
      cfpLengthLegend
      cfpStartDate
      cfpEndDate
    }
  }
`;
const UPDATE_EVENT_CFP = gql`
  mutation(
    $id: Int!
    $token: String!
    $cfpRules: String!
    $cfpForceGithub: String!
    $cfpEndDate: String!
  ) {
    updateEvent(
      id: $id
      token: $token
      cfpRules: $cfpRules
      cfpForceGithub: $cfpForceGithub
      cfpLengthLegend: $cfpLengthLegend
      cfpStartDate: $cfpStartDate
      cfpEndDate: $cfpEndDate
    ) {
      cfpRules
      cfpForceGithub
      cfpLengthLegend
      cfpStartDate
      cfpEndDate
    }
  }
`;

export default function CallForPaper() {
  const adminToken = useRecoilValue(adminTokenState);
  const [cfpEvent, setCfpEvent] = useState<Event | null>();
  const {event} = useContext(DataContext);
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(true);

  async function fetchSpeakerInfo() {
    try {
      const result = await client.query({
        query: ADMIN_EVENT_CFP,
        fetchPolicy: 'network-only',
        variables: {
          id: event?.id,
          token: adminToken?.token,
        },
      });
      setCfpEvent(result.data.adminEvents);
    } catch (e) {
      Alert.alert('Unable to fetch', JSON.stringify(e));
    }
    setLoading(false);
  }

  async function onSubmit(data: any) {
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: UPDATE_EVENT_CFP,
        variables: {
          id: event?.id,
          token: adminToken?.token,
          ...data,
        },
      });
      setCfpEvent(result.data.updateEvent);
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
            label="cfp rules"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="cfpRules"
        defaultValue={cfpEvent?.cfpRules}
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
