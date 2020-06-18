import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, ScrollView, View, InteractionManager} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {useRecoilState} from 'recoil';

import BottomFAB from '../components/BottomFAB';
import LinkButton from '../components/LinkButton';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import Tickets from '../components/Tickets';
import ShareInfo from '../components/shareInfo';
import {ticketState} from '../context/ticketState';
import {PrimaryTabNavigationProp} from '../typings/navigation';
import {getTickets, checkSharingInfo} from '../utils';

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
  const [ready, setReady] = useState(Platform.OS !== 'android');
  const [visible, setVisible] = useState(false);

  const [tickets, setTickets] = useRecoilState(ticketState);
  const isSharingInfo = checkSharingInfo(tickets);

  useFocusEffect(
    React.useCallback(() => {
      InteractionManager.runAfterInteractions(async () => {
        if (!tickets) {
          const userTickets = await getTickets();
          setTickets(userTickets);
        }
        setReady(true);
      });
    }, [tickets])
  );

  if (!ready) {
    return null;
  }
  return (
    <AnimatableView
      animation="fadeIn"
      useNativeDriver
      duration={800}
      style={Platform.OS === 'web' ? {alignItems: 'center'} : {}}>
      {!tickets || tickets.length <= 0 ? (
        <LinkButton to="/QRScanner">
          <PrimaryButton>
            <SemiBoldText fontSize="md" TextColorAccent>
              Scan your ticket QR code
            </SemiBoldText>
          </PrimaryButton>
        </LinkButton>
      ) : (
        <PrimaryButton onPress={() => setVisible(true)}>
          <SemiBoldText fontSize="md" TextColorAccent>
            {isSharingInfo ? 'Disable share info' : 'Enable share info'}
          </SemiBoldText>
        </PrimaryButton>
      )}
      {tickets &&
        tickets.map((ticket) => {
          console.log(ticket.shareInfo);
          console.log(ticket.uuid);
        })}
      {tickets && (
        <Tickets
          tickets={tickets}
          style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
        />
      )}
      <ShareInfo isSharingInfo visible={visible} setVisible={setVisible} />
    </AnimatableView>
  );
}

export default Profile;
