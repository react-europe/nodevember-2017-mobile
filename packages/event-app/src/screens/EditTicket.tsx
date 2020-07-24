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
import {useRecoilState} from 'recoil';

import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import DateTimePicker from '../components/dateTimePicker';
import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import {GET_TICKET_INFO, UPDATE_TICKET, CREATE_TICKET} from '../data/tickets';
import {AdminTicket} from '../typings/data';
import {MenuTabProps} from '../typings/navigation';
import client from '../utils/gqlClient';

export default function EditSpeaker(props: MenuTabProps<'EditTicket'>) {
  const [adminToken] = useRecoilState(adminTokenState);
  const {event} = useContext(DataContext);
  const {control, handleSubmit} = useForm();
  const [ticket, setTicket] = useState<AdminTicket | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const {route, navigation} = props;
  const ticketId = route.params?.ticketId;
  const {colors} = useTheme();

  async function fetchSpeakerInfo() {
    try {
      const result = await client.query({
        query: GET_TICKET_INFO,
        fetchPolicy: 'no-cache',
        variables: {
          id: event?.id,
          token: adminToken?.token,
          ticketId,
        },
      });
      const ticketInfo: AdminTicket = result.data.adminEvents.tickets[0];
      if (ticketInfo) {
        ticketInfo.price = ticketInfo.price ? ticketInfo.price / 10000 : 0;
        setTicket(ticketInfo);
        setStartDate(new Date(ticketInfo.startDate));
        setEndDate(new Date(ticketInfo.endDate));
      }
    } catch (e) {
      Alert.alert('Unable to fetch', JSON.stringify(e));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!adminToken?.token || !event?.id || !route.params?.ticketId) {
      setLoading(false);
      return;
    }
    fetchSpeakerInfo();
  }, [adminToken, event]);

  async function onSubmit(data: any) {
    setLoading(true);
    data.price = parseInt(data.price, 10) * 10000 || 0;
    data.quantity = parseInt(data.quantity, 10) || 0;
    data.maxPerOrder = parseInt(data.maxPerOrder, 10) || 0;
    const id = ticketId ? ticketId : event?.id;
    try {
      await client.mutate({
        mutation: ticketId ? UPDATE_TICKET : CREATE_TICKET,
        variables: {
          id,
          token: adminToken?.token,
          startDate: startDate.toString(),
          endDate: endDate.toString(),
          includeVat: ticket?.includeVat,
          showVat: ticket?.showVat,
          showDaysLeft: ticket?.showDaysLeft,
          showTicketsLeft: ticket?.showTicketsLeft,
          showTicketsBeforeStart: ticket?.showTicketsBeforeStart,
          showTicketsPriceBeforeStart: ticket?.showTicketsBeforeStart
            ? ticket?.showTicketsPriceBeforeStart
            : false,
          ...data,
        },
      });
      navigation.navigate('Tickets');
    } catch (e) {
      Alert.alert('Update failed', JSON.stringify(e));
    }
    setLoading(false);
  }

  function updateCheckBox(field: keyof AdminTicket) {
    const ticketCpy = {...ticket};
    if (ticketCpy) {
      ticketCpy[field] = !ticketCpy[field];
      setTicket(ticketCpy);
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
        defaultValue={ticket?.name}
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
        defaultValue={ticket?.description}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Quantity"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            keyboardType="numeric"
            textContentType="none"
            autoCompleteType="off"
          />
        )}
        name="quantity"
        defaultValue={ticket?.quantity?.toString()}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Max per order"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            keyboardType="numeric"
            textContentType="none"
            autoCompleteType="off"
          />
        )}
        name="maxPerOrder"
        defaultValue={ticket?.maxPerOrder?.toString()}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Price"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            keyboardType="numeric"
            textContentType="none"
            autoCompleteType="off"
          />
        )}
        name="price"
        defaultValue={ticket?.price?.toString()}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Thank you text"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="thankYouText"
        defaultValue={ticket?.thankYouText}
      />
      <Controller
        control={control}
        render={({onChange, onBlur, value}) => (
          <TextInput
            style={styles.input}
            label="Mobile message"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            textContentType="none"
            autoCompleteType="off"
            multiline
          />
        )}
        name="mobileMessage"
        defaultValue={ticket?.mobileMessage}
      />
      <View style={styles.timeContainer}>
        <Text>Start date: {startDate && startDate.toLocaleString()}</Text>
        <DateTimePicker date={startDate} setDate={setStartDate} />
      </View>
      <View style={styles.timeContainer}>
        <Text>End date: {endDate && endDate.toLocaleString()}</Text>
        <DateTimePicker date={endDate} setDate={setEndDate} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Include vat</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('includeVat')}
          value={ticket?.includeVat || false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Show vat</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('showVat')}
          value={ticket?.showVat || false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Show days left</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('showDaysLeft')}
          value={ticket?.showDaysLeft || false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Show tickets left</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('showTicketsLeft')}
          value={ticket?.showTicketsLeft || false}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Show tickets before start</Text>
        <Switch
          trackColor={{false: '#767577', true: colors.primary}}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => updateCheckBox('showTicketsBeforeStart')}
          value={ticket?.showTicketsBeforeStart || false}
        />
      </View>
      {ticket?.showTicketsBeforeStart && (
        <View style={styles.switchContainer}>
          <Text>Show tickets price before start</Text>
          <Switch
            trackColor={{false: '#767577', true: colors.primary}}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => updateCheckBox('showTicketsPriceBeforeStart')}
            value={ticket?.showTicketsPriceBeforeStart || false}
          />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <PrimaryButton onPress={handleSubmit(onSubmit)}>
          <SemiBoldText fontSize="md" TextColorAccent>
            {ticketId ? 'Update' : 'Create'}
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
