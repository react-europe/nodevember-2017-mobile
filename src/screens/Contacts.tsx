import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, AsyncStorage, View, InteractionManager} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {useRecoilState} from 'recoil';

import BottomFAB from '../components/BottomFAB';
import MyContacts from '../components/MyContacts';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import {ticketState} from '../context/ticketState';
import {Attendee} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';
import {getTickets} from '../utils';

export default function Contacts() {
  const navigation = useNavigation<PrimaryTabNavigationProp<'Contacts'>>();
  const [ready, setReady] = useState(false);
  const [tickets, setTickets] = useRecoilState(ticketState);
  const [contacts, setContacts] = useState<Attendee[]>([]);

  async function getContent() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:contacts');
      if (value) {
        setContacts(JSON.parse(value));
      }
    } catch (err) {
      console.log(err);
      setContacts([]);
    }
    if (!tickets) {
      const userTickets = await getTickets();
      setTickets(userTickets);
    }
    if (!ready) {
      setReady(true);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      InteractionManager.runAfterInteractions(() => {
        getContent();
      });
    }, [tickets])
  );

  const _handlePressProfileQRButton = () => {
    navigation.navigate('QRScanner');
  };

  const handlePressQRButton = () => {
    navigation.navigate('QRContactScanner');
  };

  if (!ready) {
    return null;
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
          {!tickets || tickets.length <= 0 ? (
            <PrimaryButton onPress={_handlePressProfileQRButton}>
              <SemiBoldText fontSize="md" TextColorAccent>
                You need to scan your ticket first
              </SemiBoldText>
            </PrimaryButton>
          ) : (
            <SemiBoldText fontSize="md" TextColorAccent>
              Hey
            </SemiBoldText>
          )}
          {tickets && (
            <MyContacts
              contacts={contacts}
              tickets={tickets}
              style={{marginTop: 10, marginHorizontal: 15, marginBottom: 2}}
            />
          )}
        </AnimatableView>
      </ScrollView>
      {tickets && tickets.length > 0 && (
        <BottomFAB onPress={handlePressQRButton} />
      )}
    </View>
  );
}
