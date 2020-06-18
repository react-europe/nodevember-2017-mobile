import {useNavigation} from '@react-navigation/native';
import orderBy from 'lodash/orderBy';
import React, {useState, useEffect} from 'react';
import {Query} from 'react-apollo';
import {Platform, Text, StyleSheet, View, LayoutAnimation} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {Searchbar} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import AttendeesSearchResults from '../components/AttendeesSearchResults';
import OverscrollView from '../components/OverscrollView';
import {GQL, Layout, FontSizes} from '../constants';
import {ticketState} from '../context/ticketState';
import GET_ATTENDEES from '../data/attendeesquery';
import {Event, User, Attendee} from '../typings/data';
import {MenuNavigationProp} from '../typings/navigation';
import {getContactTwitter, getTickets, getUuid} from '../utils';

type DeferredAttendeesContentProps = {
  aquery: string;
};

type QueryAttendees = {
  events: Event[];
};

export default function Attendees() {
  const [aquery, setAquery] = useState('');
  const [search, setSearch] = useState('');

  const throttleDelayMs = 200;
  let throttleTimeout: number;
  const queryThrottle = (text: string) => {
    setSearch(text);
    if (throttleTimeout) {
      clearTimeout(throttleTimeout);
    }

    throttleTimeout = setTimeout(() => {
      LayoutAnimation.easeInEaseOut();
      setAquery(text);
    }, throttleDelayMs);
  };

  useEffect(() => {
    return function unmount() {
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, []);

  return (
    <View style={[{flex: 1}, Platform.OS === 'web' && {alignItems: 'center'}]}>
      <Searchbar
        onChangeText={(text: string) => queryThrottle(text)}
        placeholder="Search for conference attendees"
        inputStyle={{fontSize: FontSizes.sm}}
        style={[
          styles.textInput,
          Platform.OS === 'web' ? styles.textInputWeb : styles.textInputMobile,
        ]}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        value={search}
      />
      <DeferredAttendeesContent aquery={aquery} />
      <OverscrollView />
    </View>
  );
}

function DeferredAttendeesContent(props: DeferredAttendeesContentProps) {
  const navigation = useNavigation<MenuNavigationProp<'Attendees'>>();
  const [ready, setReady] = useState(Platform.OS !== 'android');
  const [tickets, setTickets] = useRecoilState(ticketState);
  const [uuid, setUuid] = useState('');
  let timer: number;

  useEffect(() => {
    _getUuid();
    if (ready) {
      return;
    }
    timer = setTimeout(() => setReady(true), 200);
    return function unmount() {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [tickets]);

  async function _getUuid() {
    let userTickets: User[] = [];
    if (!tickets) {
      userTickets = await getTickets();
      setTickets(userTickets);
    } else {
      userTickets = tickets;
    }
    const userUuid = getUuid(userTickets);
    setUuid(userUuid);
  }

  const _handlePressRow = (attendee: Attendee) => {
    navigation.navigate('AttendeeDetail', {attendee});
  };

  if (!ready) {
    return null;
  }
  const {aquery} = props;
  const cleanedQuery = aquery.toLowerCase().trim();
  const vars = {slug: GQL.slug, q: 'a', uuid};
  // console.log(GET_ATTENDEES, vars);

  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      {uuid !== '' ? (
        <Query<QueryAttendees> query={GET_ATTENDEES} variables={vars}>
          {({loading, error, data}) => {
            if (error) {
              return <Text>Error ${error}</Text>;
            }

            const attendees =
              data?.events && data.events[0] ? data.events[0].attendees : [];
            let attendeesData: Attendee[] = [];
            if (cleanedQuery === '' && attendees) {
              attendeesData = orderBy(
                attendees,
                (attendee) => `${attendee?.firstName} ${attendee?.lastName}`,
                ['asc']
              ) as Attendee[];
            } else {
              const filteredAttendees: Attendee[] = [];
              const attendeesSearchRankingScore: {[id: string]: number} = {};
              if (attendees) {
                attendees.forEach((attendee) => {
                  const fullName = `${
                    attendee?.firstName ? attendee.firstName : ''
                  } ${attendee?.lastName ? attendee?.lastName : ''}`;
                  const matchesName = fullName
                    .toLowerCase()
                    .trim()
                    .includes(cleanedQuery);
                  const matchesEmail = attendee?.email
                    ? attendee.email.toLowerCase().trim().includes(cleanedQuery)
                    : '';
                  const matchesTwitter = getContactTwitter(attendee as Attendee)
                    .toLowerCase()
                    .trim()
                    .includes(cleanedQuery);

                  attendeesSearchRankingScore[`${attendee?.id}`] = 0;
                  if (matchesName || matchesEmail || matchesTwitter) {
                    if (attendee) {
                      filteredAttendees.push(attendee);
                    }
                  }
                  if (matchesName) {
                    attendeesSearchRankingScore[`${attendee?.id}`] += 1;
                  }
                  if (matchesEmail) {
                    attendeesSearchRankingScore[`${attendee?.id}`] += 1;
                  }
                  if (matchesTwitter) {
                    attendeesSearchRankingScore[`${attendee?.id}`] += 1;
                  }
                });
              }
              const sortedFilteredAttendees = orderBy(
                filteredAttendees,
                (attendee) => attendeesSearchRankingScore[`${attendee.id}`],
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
              />
            );
          }}
        </Query>
      ) : null}
    </AnimatableView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    top: Layout.notchHeight,
    marginLeft: 6,
    marginRight: 6,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: 'black',
  },
  textInputMobile: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  textInputWeb: {
    width: 400,
    marginTop: 10,
  },
});
