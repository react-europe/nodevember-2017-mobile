import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import {Query} from 'react-apollo';
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

import AttendeesSearchResults from '../components/AttendeesSearchResults';
import OverscrollView from '../components/OverscrollView';
import {GQL, Layout, FontSizes} from '../constants';
import GET_ATTENDEES from '../data/attendeesquery';
import {Event, User, Attendee} from '../typings/data';
import {MenuNavigationProp} from '../typings/navigation';
import {getContactTwitter} from '../utils';
import useScreenWidth from '../utils/useScreenWidth';

type DeferredAttendeesContentProps = {
  aquery: string;
};

type QueryAttendees = {
  events: Event[];
};

export default function Attendees() {
  const isLargeScreen = useScreenWidth();
  const [aquery, setAquery] = useState('');
  const [search, setSearch] = useState('');

  const throttleDelayMs = 200;
  let throttleTimeout: NodeJS.Timer;
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
    <View style={[{flex: 1}, isLargeScreen && {alignItems: 'center'}]}>
      <Searchbar
        onChangeText={(text: string) => queryThrottle(text)}
        placeholder="Search for conference attendees"
        inputStyle={{fontSize: FontSizes.sm}}
        style={[
          styles.textInput,
          isLargeScreen ? styles.textInputWeb : styles.textInputMobile,
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
  const [uuid, setUuid] = useState('');
  let timer: NodeJS.Timer;

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
  }, []);

  async function _getUuid() {
    const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
    if (!value) {
      return null;
    }
    const tickets: User[] = JSON.parse(value) || [];
    tickets.map((ticket) => {
      if (ticket?.checkinLists) {
        ticket.checkinLists.map((ch) => {
          if (ch?.mainEvent) {
            setUuid(ticket.uuid ? ticket.uuid : '');
          }
        });
      }
    });
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
              attendeesData = _.orderBy(
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
              const sortedFilteredAttendees = _.orderBy(
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
