import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {ScrollView, RectButton} from 'react-native-gesture-handler';

import {FontSizes, Colors} from '../constants';
import {RegularText} from '../components/StyledText';
import LoadingPlaceholder from '../components/LoadingPlaceholder';

const BORDER_RADIUS = 3;
export function StaffCheckinListRow(props) {
  const _handleCheckinListPress = () => {
    props.navigation.navigate('QRCheckinScanner', {
      checkinList: props.item,
      uuid: props.uuid,
    });
  };
  const {item: item} = props;
  return (
    <TouchableOpacity onPress={_handleCheckinListPress}>
      <RectButton
        activeOpacity={0.05}
        style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.row}>
          {item.name ? (
            <View>
              <RegularText>{item.name}</RegularText>
            </View>
          ) : null}
        </View>
      </RectButton>
    </TouchableOpacity>
  );
}

export default function StaffCheckinLists(props) {
  const [staffCheckinLists, setStaffCheckinLists] = useState([]);
  const [uuid, setUuid] = useState([]);

  async function getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      const json = JSON.parse(value) || [];
      let staffCheckinListsArray = [];
      let uuid = '';
      json.map(ticket => {
        if (
          ticket &&
          ticket.staffCheckinLists &&
          ticket.staffCheckinLists.length > 0
        ) {
          staffCheckinListsArray = ticket.staffCheckinLists;
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
    getTickets();
  }, []);

  const _renderSectionHeader = ({section}) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText>{section.title}</RegularText>
      </View>
    );
  };
  const _renderItem = ({item}) => {
    return (
      <StaffCheckinListRow
        item={item}
        id={item.id}
        uuid={uuid}
        navigation={props.navigation}
      />
    );
  };
  const checkinLists = staffCheckinLists || [];
  return (
    <LoadingPlaceholder>
      <FlatList
        renderScrollComponent={props => <ScrollView {...props} />}
        renderSectionHeader={_renderSectionHeader}
        stickySectionHeadersEnabled={true}
        data={checkinLists}
        renderItem={_renderItem}
        //<ListItem title={item.lastName} description="Press here to start checking people" icon="folder" key={item.id}/>}

        /**/
        keyExtractor={item => item.id && item.id.toString()}
      />
    </LoadingPlaceholder>
  );
}

const styles = StyleSheet.create({
  bigButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  rowAvatarContainer: {
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 0,
  },
  rowData: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
