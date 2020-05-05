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

import PrimaryButton from '../components/Buttons/PrimaryButton';
import MyContacts from '../components/MyContacts';
import {SemiBoldText} from '../components/StyledText';
import {Attendee} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';

function Contacts() {
  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <DeferredContactsContent />
      </ScrollView>
    </View>
  );
}

function DeferredContactsContent() {
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

  const _handlePressQRButton = () => {
    navigation.navigate('QRContactScanner');
  };

  const _handlePressProfileQRButton = () => {
    navigation.navigate('QRScanner');
  };

  if (!ready) {
    return null;
  }
  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      <MyContacts
        contacts={contacts}
        tickets={tickets}
        style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
      />
      {tickets && tickets.length > 0 ? (
        <PrimaryButton onPress={_handlePressQRButton}>
          <SemiBoldText fontSize="md" accent>
            Scan a contact's QR code
          </SemiBoldText>
        </PrimaryButton>
      ) : (
        <PrimaryButton onPress={_handlePressProfileQRButton}>
          <SemiBoldText fontSize="md" accent>
            You need to scan your ticket first
          </SemiBoldText>
        </PrimaryButton>
      )}
    </AnimatableView>
  );
}

export default Contacts;
