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

const ADMIN_EVENT_INVOICE = gql`
  query AdminMainEvent($id: Int!, $token: String!) {
    adminEvents(id: $id, token: $token) {
      invoiceAddress
      invoiceVatNumber
      invoiceCompanyName
    }
  }
`;
const UPDATE_EVENT_INVOICE = gql`
  mutation(
    $id: Int!
    $token: String!
    $invoiceAddress: String!
    $invoiceVatNumber: String!
    $invoiceCompanyName: String!
  ) {
    updateEvent(
      id: $id
      token: $token
      invoiceAddress: $invoiceAddress
      invoiceVatNumber: $invoiceVatNumber
      invoiceCompanyName: $invoiceCompanyName
    ) {
      invoiceAddress
      invoiceVatNumber
      invoiceCompanyName
    }
  }
`;

export default function Invoice() {
  const adminToken = useRecoilValue(adminTokenState);
  const [invoiceEvent, setInvoiceEvent] = useState<Event | null>();
  const {event} = useContext(DataContext);
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(true);

  async function fetchSpeakerInfo() {
    try {
      const result = await client.query({
        query: ADMIN_EVENT_INVOICE,
        fetchPolicy: 'network-only',
        variables: {
          id: event?.id,
          token: adminToken?.token,
        },
      });
      console.log(result.data.adminEvents);
      setInvoiceEvent(result.data.adminEvents);
    } catch (e) {
      Alert.alert('Unable to fetch', JSON.stringify(e));
    }
    setLoading(false);
  }

  async function onSubmit(data: any) {
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: UPDATE_EVENT_INVOICE,
        variables: {
          id: event?.id,
          token: adminToken?.token,
          ...data,
        },
      });
      setInvoiceEvent(result.data.updateEvent);
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
            label="Invoice address"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="invoiceAddress"
        defaultValue={invoiceEvent?.invoiceAddress}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Invoice Vat number"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="invoiceVatNumber"
        defaultValue={invoiceEvent?.invoiceVatNumber}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="Invoice company name"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="invoiceCompanyName"
        defaultValue={invoiceEvent?.invoiceCompanyName}
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
