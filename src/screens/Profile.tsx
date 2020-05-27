import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  View,
  AsyncStorage,
  InteractionManager,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';

import BottomFAB from '../components/BottomFAB';
import LinkButton from '../components/LinkButton';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import Tickets from '../components/Tickets';
import {User} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';

function Profile() {
  const navigation = useNavigation<PrimaryTabNavigationProp<'Profile'>>();

  const handleAddTicket = async () => {
    navigation.navigate('QRScanner');
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <DeferredProfileContent />
      </ScrollView>
      <BottomFAB onPress={handleAddTicket} />
    </View>
  );
}

function DeferredProfileContent() {
  const [tickets, setTickets] = useState<User[]>([]);
  const [ready, setReady] = useState(Platform.OS !== 'android');

  const getTickets = async () => {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      if (value) {
        const tickets: User[] = JSON.parse(value);
        setTickets(tickets);
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (!ready) {
        setReady(true);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      InteractionManager.runAfterInteractions(() => {
        getTickets();
      });
    }, [])
  );

  if (!ready) {
    return null;
  }
  return (
    <AnimatableView
      animation="fadeIn"
      useNativeDriver
      duration={800}
      style={{alignItems: 'center'}}>
      {!tickets || tickets.length <= 0 ? (
        <LinkButton to="/QRScanner">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Scan your ticket QR code
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : null}
      <Tickets
        tickets={tickets}
        style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
      />
    </AnimatableView>
  );
}

export default Profile;
