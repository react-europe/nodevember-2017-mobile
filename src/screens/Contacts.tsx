import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  AsyncStorage,
  View,
  InteractionManager,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';

import BottomFAB from '../components/BottomFAB';
import MyContacts from '../components/MyContacts';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import {Attendee} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';

export default function Contacts() {
  const navigation = useNavigation<PrimaryTabNavigationProp<'Contacts'>>();
  const [ready, setReady] = useState(Platform.OS !== 'android');
  const [tickets, setTickets] = useState<Attendee[]>([]);
  const [contacts, setContacts] = useState<Attendee[]>([]);

  async function getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:contacts');
      if (value) {
        setContacts(JSON.parse(value));
      }
    } catch (err) {
      console.log(err);
      setContacts([]);
    }
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      if (value) {
        setTickets(JSON.parse(value));
      }
    } catch (err) {
      console.log(err);
      return [];
    }
    if (!ready) {
      setReady(true);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      InteractionManager.runAfterInteractions(() => {
        getTickets();
      });
    }, [])
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
          {tickets.length <= 0 ? (
            <PrimaryButton onPress={_handlePressProfileQRButton}>
              <SemiBoldText fontSize="md" TextColorAccent>
                You need to scan your ticket first
              </SemiBoldText>
            </PrimaryButton>
          ) : null}
          <MyContacts
            contacts={contacts}
            tickets={tickets}
            style={{marginTop: 10, marginHorizontal: 15, marginBottom: 2}}
          />
        </AnimatableView>
      </ScrollView>
      {tickets.length > 0 && <BottomFAB onPress={handlePressQRButton} />}
    </View>
  );
}
