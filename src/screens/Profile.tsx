import {useFocusEffect, useNavigation} from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  View,
  AsyncStorage,
  InteractionManager,
  Alert,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';

import BottomFAB from '../components/BottomFAB';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import Tickets from '../components/Tickets';
import {User} from '../typings/data';
import {PrimaryTabNavigationProp} from '../typings/navigation';

function Profile() {
  const navigation = useNavigation<PrimaryTabNavigationProp<'Profile'>>();

  const _requestCameraPermission = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    const hasCameraPermission = status === 'granted';
    return hasCameraPermission;
  };

  const handleAddTicket = async () => {
    if (await _requestCameraPermission()) {
      navigation.navigate('QRScanner');
    } else {
      Alert.alert(
        'You need to manually enable camera permissions in your operating system settings app'
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <DeferredProfileContent handleAddTicket={handleAddTicket} />
      </ScrollView>
      <BottomFAB onPress={handleAddTicket} />
    </View>
  );
}

function DeferredProfileContent(props: {handleAddTicket: () => void}) {
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
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      {!tickets || tickets.length <= 0 ? (
        <PrimaryButton onPress={props.handleAddTicket}>
          <SemiBoldText fontSize="md" accent>
            Scan your ticket QR code
          </SemiBoldText>
        </PrimaryButton>
      ) : null}
      <Tickets
        tickets={tickets}
        style={{marginTop: 20, marginHorizontal: 15, marginBottom: 2}}
      />
    </AnimatableView>
  );
}

export default Profile;
