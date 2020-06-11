import React, {useEffect, useState} from 'react';
import {TouchableOpacity, FlatList, StyleSheet, View} from 'react-native';
import {ScrollView, RectButton} from 'react-native-gesture-handler';
import {useRecoilState} from 'recoil';

import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {RegularText} from '../components/StyledText';
import {ticketState} from '../context/ticketState';
import {Event, User, CheckinList} from '../typings/data';
import {AppNavigationProp} from '../typings/navigation';
import {getTickets} from '../utils';

type Props = {
  event: Event;
  navigation: AppNavigationProp<'StaffCheckinLists'>;
};

type StaffCheckinListRowProps = {
  navigation: AppNavigationProp<'StaffCheckinLists'>;
  item: CheckinList;
  uuid: string;
};

export function StaffCheckinListRow(props: StaffCheckinListRowProps) {
  const _handleCheckinListPress = () => {
    props.navigation.navigate('QRCheckinScanner', {
      checkinList: props.item,
      uuid: props.uuid,
    });
  };
  const {item} = props;
  return (
    <TouchableOpacity onPress={_handleCheckinListPress}>
      <RectButton
        activeOpacity={0.05}
        style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.row}>
          {item.name ? (
            <View>
              <RegularText fontSize="sm">{item.name}</RegularText>
            </View>
          ) : null}
        </View>
      </RectButton>
    </TouchableOpacity>
  );
}

export default function StaffCheckinLists(props: Props) {
  const [staffCheckinLists, setStaffCheckinLists] = useState<CheckinList[]>([]);
  const [tickets, setTickets] = useRecoilState(ticketState);
  const [uuid, setUuid] = useState('');

  async function getCheckinLists() {
    let userTickets: User[] = [];
    try {
      if (!tickets) {
        userTickets = await getTickets();
        setTickets(userTickets);
      }
      const checkTicket = tickets ? tickets : userTickets;
      let staffCheckinListsArray: CheckinList[] = [];
      let uuid = '';
      checkTicket.map((ticket) => {
        if (ticket?.staffCheckinLists && ticket.staffCheckinLists.length > 0) {
          staffCheckinListsArray = ticket.staffCheckinLists as CheckinList[];
        }
        if (ticket.uuid) {
          uuid = ticket.uuid;
        }
      });
      setStaffCheckinLists(staffCheckinListsArray);
      setUuid(uuid);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  useEffect(() => {
    getCheckinLists();
  }, [tickets]);

  const _renderItem = ({item}: {item: CheckinList}) => {
    return (
      <StaffCheckinListRow
        item={item}
        uuid={uuid}
        navigation={props.navigation}
      />
    );
  };
  return (
    <LoadingPlaceholder>
      <FlatList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        data={staffCheckinLists}
        renderItem={_renderItem}
        //<ListItem title={item.lastName} description="Press here to start checking people" icon="folder" key={item.id}/>}

        /**/
      />
    </LoadingPlaceholder>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
});
