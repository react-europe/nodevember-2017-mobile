import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Animated,
  Platform,
  Text,
  StyleSheet,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';

import AnimatedScrollView from '../components/AnimatedScrollView';
import NavigationBar from '../components/NavigationBar';
import MenuButton from '../components/MenuButton';
import { Colors, FontSizes, Layout } from '../constants';
import ContactCard from '../components/ContactCard';
import GET_ATTENDEES from '../data/attendeesquery';
import { getContactTwitter } from '../utils';

export const Schedule = require('../data/schedule.json');

class Attendees extends React.Component {
  state = {
    scrollY: new Animated.Value(0),
  };

  render() {
    const { scrollY } = this.state;
    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{ flex: 1 }}>
        <AnimatedScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 + Layout.notchHeight / 2 }}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: scrollY } },
              },
            ],
            { useNativeDriver: true }
          )}
        >
          <View
            style={{
              backgroundColor: '#4d5fab',
              padding: 10,
              paddingTop: Layout.headerHeight - 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <DeferredAttendeesContent />
          <OverscrollView />
        </AnimatedScrollView>

        <NavigationBar
          renderLeftButton={() => <MenuButton />}
          animatedBackgroundOpacity={headerOpacity}
        />
      </View>
    );
  }
}

@withNavigation
class DeferredAttendeesContent extends React.Component {
  state = {
    ready: Platform.OS === 'android' ? false : true,
    attendees: [],
    query: '',
  };

  componentDidMount() {
    if (this.state.ready) {
      return;
    }

    setTimeout(() => {
      this.setState({ ready: true });
    }, 200);
  }

  throttleDelayMs = 50
  throttleTimeout = null
  queryThrottle = text => {
    clearTimeout(this.throttleTimeout);
    this.throttleTimeout = setTimeout(() => this.setState({ query: text }), this.throttleDelayMs);
  }

  _renderItem = ({ item: attendee }) => (
    <ContactCard
      key={attendee.id}
      contact={attendee}
      tickets={this.state.tickets}
      onPress={this._handlePressRow}
    />
  );

  _handlePressRow = attendee => {
    this.props.navigation.navigate('AttendeeDetail', { attendee });
  };

  render() {
    if (!this.state.ready) {
      return null;
    }
    const { query } = this.state;
    const cleanedQuery = query.toLowerCase().trim();
    console.log('State:', this.state);
  
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <Query query={GET_ATTENDEES}>
          {({ loading, error, data }) => {
            if (error) {
              return <Text>Error ${error}</Text>;
            }
            const attendees = data && data.events && data.events[0] ? data.events[0].attendees : [];
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
            const sortedFilteredAttendees = filteredAttendees.sort((attendee1, attendee2) => {
              return (
                attendeesSearchRankingScore[`${attendee2.id}`] -
                attendeesSearchRankingScore[`${attendee1.id}`]
              );
            });
            console.log('Attendees: ', sortedFilteredAttendees);
            console.log('Rankings: ', attendeesSearchRankingScore);

            return (
              <React.Fragment>
                <TextInput
                  onChangeText={text => this.queryThrottle(text)}
                  placeholder="Search for conference attendees"
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  returnKeyLabel="Search"
                  style={styles.textInput}
                />
                <FlatList
                  renderScrollComponent={props => <ScrollView {...props} />}
                  renderItem={this._renderItem}
                  renderHeader={this._renderHeader}
                  data={sortedFilteredAttendees}
                  keyExtractor={item => `${item.id}`}
                  initialNumToRender={10}
                  keyboardDismissMode="on-drag"
                />
              </React.Fragment>
            );
          }}
        </Query>
      </AnimatableView>
    );
  }
}

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

const ClipBorderRadius = ({ children, style }) => {
  return (
    <View style={[{ borderRadius: BORDER_RADIUS, overflow: 'hidden', marginTop: 10 }, style]}>
      {children}
    </View>
  );
};

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
  headerContent: {
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 10,
  },
  headerVideoLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  headerVideoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.blue,
    opacity: 0.8,
  },
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 17 * 1.5,
  },
  headerSmallText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 7,
    lineHeight: 7 * 1.5,
  },
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
  seeAllTalks: {
    fontSize: FontSizes.normalButton,
    color: Colors.blue,
  },
  autocompleteContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    backgroundColor: '#fff',
    flexDirection: 'row',
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
  textInput: {
    backgroundColor: 'white',
    margin: 5,
    padding: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
    fontSize: 16,
  },
});

export default Attendees;
