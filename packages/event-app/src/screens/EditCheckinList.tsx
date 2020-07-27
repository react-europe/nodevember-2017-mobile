import {gql} from 'apollo-boost';
import React, {useEffect, useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  TextInput,
  Text,
  ActivityIndicator,
  Switch,
  useTheme,
} from 'react-native-paper';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {useRecoilState} from 'recoil';

import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {AdminCheckinList} from '../typings/data';
import {MenuTabProps} from '../typings/navigation';
import client from '../utils/gqlClient';

const GET_CHECKINLIST = gql`
  query CheckinList($id: Int!, $token: String!, $checkinListId: Int!) {
    adminEvents(id: $id, token: $token) {
      checkinLists(checkinListId: $checkinListId) {
        name
        sponsor
        includeInMobile
        includeInQrScan
        mainEvent
        ticketIds
      }
      tickets {
        name
        id
      }
    }
  }
`;

const UPDATE_CHECKINLIST = gql`
  mutation updateCheckinList(
    $id: Int!
    $eventId: Int!
    $token: String!
    $name: String!
    $sponsor: Boolean!
    $includeInMobile: Boolean!
    $includeInQrScan: Boolean!
    $mainEvent: Boolean!
    $ticketIds: [Int]!
  ) {
    updateCheckinlist(
      id: $id
      eventId: $eventId
      token: $token
      name: $name
      sponsor: $sponsor
      includeInMobile: $includeInMobile
      includeInQrScan: $includeInQrScan
      mainEvent: $mainEvent
      ticketIds: $ticketIds
    ) {
      name
    }
  }
`;

const CREATE_CHECKINLIST = gql`
  mutation createCheckinlist(
    $eventId: Int!
    $token: String!
    $name: String!
    $sponsor: Boolean
    $includeInMobile: Boolean
    $includeInQrScan: Boolean
    $mainEvent: Boolean
    $ticketIds: [Int]
  ) {
    createCheckinlist(
      eventId: $eventId
      token: $token
      name: $name
      sponsor: $sponsor
      includeInMobile: $includeInMobile
      includeInQrScan: $includeInQrScan
      mainEvent: $mainEvent
      ticketIds: $ticketIds
    ) {
      name
    }
  }
`;

export default function EditCheckinList(
  props: MenuTabProps<'EditCheckinList'>
) {
  const [adminToken] = useRecoilState(adminTokenState);
  const {event} = useContext(DataContext);
  const {control, handleSubmit} = useForm();
  const [checkinList, setCheckinList] = useState<AdminCheckinList | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const {route, navigation} = props;
  const checkinListId = route.params?.checkinListId;
  const {colors} = useTheme();

  async function fetchSpeakerInfo() {
    try {
      const result = await client.query({
        query: GET_CHECKINLIST,
        fetchPolicy: 'no-cache',
        variables: {
          id: event?.id,
          token: adminToken?.token,
          checkinListId,
        },
      });
      const checkinListInfo: AdminCheckinList =
        result.data.adminEvents.checkinLists[0];
      if (checkinListInfo) {
        setCheckinList(checkinListInfo);
        if (checkinListInfo.ticketIds) {
          setSelected(checkinListInfo.ticketIds as number[]);
        }
        setTickets(result.data.adminEvents.tickets);
      }
    } catch (e) {
      Alert.alert('Unable to fetch', JSON.stringify(e));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!adminToken?.token || !event?.id || !route.params?.checkinListId) {
      setLoading(false);
      return;
    }
    fetchSpeakerInfo();
  }, [adminToken, event]);

  async function onSubmit(data: any) {
    setLoading(true);
    const variables = {
      eventId: event?.id,
      token: adminToken?.token,
      sponsor: checkinList?.sponsor,
      includeInMobile: checkinList?.includeInMobile,
      includeInQrScan: checkinList?.includeInQrScan,
      mainEvent: checkinList?.mainEvent,
      ...data,
      ticketIds: selected,
    };
    if (checkinList) {
      variables['id'] = checkinListId;
    }
    try {
      await client.mutate({
        mutation: checkinListId ? UPDATE_CHECKINLIST : CREATE_CHECKINLIST,
        variables,
      });
      navigation.navigate('CheckinLists');
    } catch (e) {
      Alert.alert('Update failed', JSON.stringify(e));
    }
    setLoading(false);
  }

  function updateCheckBox(field: keyof AdminCheckinList) {
    const checkinListCpy = {...checkinList};
    if (checkinListCpy) {
      checkinListCpy[field] = !checkinListCpy[field];
      setCheckinList(checkinListCpy);
    }
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
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            label="name"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
          />
        )}
        name="name"
        defaultValue={checkinList?.name}
      />
      <View style={styles.switchContainer}>
        <Text>Sponsor</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('sponsor')}
          value={checkinList?.sponsor || false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Include in mobile</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('includeInMobile')}
          value={checkinList?.includeInMobile || false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Allow tickets QR to be scanned</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('includeInQrScan')}
          value={checkinList?.includeInQrScan || false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Main Checkin List</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('mainEvent')}
          value={checkinList?.mainEvent || false}
        />
      </View>
      <SectionedMultiSelect
        items={tickets}
        uniqueKey="id"
        selectText="Select tickets"
        onSelectedItemsChange={(items) => setSelected(items)}
        selectedItems={selected}
      />
      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={handleSubmit(onSubmit)}>
          <SemiBoldText fontSize="md" TextColorAccent>
            {checkinListId ? 'Update' : 'Create'}
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
  timeContainer: {
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
});
