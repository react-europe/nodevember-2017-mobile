import React, {useState, useEffect} from 'react';
import {
  Platform,
  Text,
  StyleSheet,
  View,
  AsyncStorage,
  LayoutAnimation,
} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {Searchbar} from 'react-native-paper';
import {Query} from 'react-apollo';
import _ from 'lodash';

import withNavigation from '../utils/withNavigation';
import AttendeesSearchResults from '../components/AttendeesSearchResults';
import {GQL} from '../constants';
import {Colors, Layout} from '../constants';
import GET_ATTENDEES from '../data/attendeesquery';
import {getContactTwitter} from '../utils';
import {withData} from '../context/DataContext';

function Attendees(props) {
  const [aquery, setAquery] = useState('');

  const throttleDelayMs = 200;
  let throttleTimeout = null;
  const queryThrottle = text => {
    if (throttleTimeout) {
      clearTimeout(throttleTimeout);
    }

    throttleTimeout = setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      setAquery(text);
    }, throttleDelayMs);
  };

  useState(() => {
    return function unmount() {
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
        throttleTimeout = 0;
      }
    };
  });

  return (
    <View style={{flex: 1}}>
      <Searchbar
        onChangeText={text => queryThrottle(text)}
        placeholder="Search for conference attendees"
        style={styles.textInput}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      <DeferredAttendeesContentWithNavigation
        aquery={aquery}
        event={props.event}
      />
      <OverscrollView />
    </View>
  );
}

function DeferredAttendeesContent(props) {
  const [ready, setReady] = useState(Platform.OS === 'android' ? false : true);
  const [uuid, setUuid] = useState('');
  let timer = undefined;

  useEffect(() => {
    _getUuid();
    if (ready) {
      return;
    }
    timer = setTimeout(() => setReady(true), 200);
    return function unmount() {
      if (timer) {
        clearTimeout(timer);
        timer = 0;
      }
    };
  }, []);

  async function _getUuid() {
    const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
    let tickets = JSON.parse(value) || [];
    let uuid = '';
    tickets.map(ticket => {
      ticket.checkinLists.map(ch => {
        if (ch.mainEvent) {
          uuid = ticket.uuid;
          setUuid(uuid);
        }
      });
    });
  }

  const _handlePressRow = attendee => {
    props.navigation.navigate('AttendeeDetail', {attendee});
  };

  if (!ready) {
    return null;
  }
  const {aquery} = props;
  const cleanedQuery = aquery.toLowerCase().trim();
  const vars = {slug: GQL.slug, q: 'a', uuid: uuid};
  // console.log(GET_ATTENDEES, vars);
  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      {uuid != '' ? (
        <Query query={GET_ATTENDEES} variables={vars}>
          {({loading, error, data}) => {
            if (error) {
              return <Text>Error ${error}</Text>;
            }

            const attendees =
              data && data.events && data.events[0]
                ? data.events[0].attendees
                : [];
            let attendeesData;
            if (cleanedQuery === '') {
              attendeesData = _.orderBy(
                attendees,
                attendee => `${attendee.firstName} ${attendee.lastName}`,
                ['asc']
              );
            } else {
              const filteredAttendees = [];
              const attendeesSearchRankingScore = {};
              attendees.forEach(attendee => {
                const fullName = `${attendee.firstName} ${attendee.lastName}`;
                const matchesName = fullName
                  .toLowerCase()
                  .trim()
                  .includes(cleanedQuery);
                const matchesEmail = attendee.email
                  .toLowerCase()
                  .trim()
                  .includes(cleanedQuery);
                const matchesTwitter = getContactTwitter(attendee)
                  .toLowerCase()
                  .trim()
                  .includes(cleanedQuery);

                attendeesSearchRankingScore[`${attendee.id}`] = 0;
                if (matchesName || matchesEmail || matchesTwitter) {
                  filteredAttendees.push(attendee);
                }
                if (matchesName) {
                  attendeesSearchRankingScore[`${attendee.id}`] += 1;
                }
                if (matchesEmail) {
                  attendeesSearchRankingScore[`${attendee.id}`] += 1;
                }
                if (matchesTwitter) {
                  attendeesSearchRankingScore[`${attendee.id}`] += 1;
                }
              });
              const sortedFilteredAttendees = _.orderBy(
                filteredAttendees,
                attendee => attendeesSearchRankingScore[`${attendee.id}`],
                ['desc']
              );
              attendeesData = sortedFilteredAttendees;
            }

            return (
              <AttendeesSearchResults
                attendees={attendeesData}
                onPress={_handlePressRow}
                searchQuery={cleanedQuery}
                isLoading={loading}
                event={props.event}
              />
            );
          }}
        </Query>
      ) : null}
    </AnimatableView>
  );
}

const DeferredAttendeesContentWithNavigation = withNavigation(
  DeferredAttendeesContent
);

const OverscrollView = () => (
  <View
    style={{
      position: 'absolute',
      top: -400,
      height: 400,
      left: 0,
      right: 0,
      backgroundColor: Colors.blue,
    }}
  />
);

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    position: 'absolute',
    top: Layout.notchHeight,
    left: 0,
    right: 0,
    marginLeft: 6,
    marginRight: 6,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: 'black',
  },
});

export default withData(Attendees);
