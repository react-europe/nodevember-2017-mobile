import React, { Component } from 'react';
import _ from 'lodash';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Animated,
  Linking,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  View,
  TextInput,
  SectionList,
} from 'react-native';
import { Asset, LinearGradient, WebBrowser, Video } from 'expo';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { NavigationActions } from 'react-navigation';
import FadeIn from 'react-native-fade-in-image';
import { View as AnimatableView } from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
import { Query } from 'react-apollo';

import AnimatedScrollView from '../components/AnimatedScrollView';
import MyContacts from '../components/MyContacts';
import NavigationBar from '../components/NavigationBar';
import MenuButton from '../components/MenuButton';
import VideoBackground from '../components/VideoBackground';
import { BoldText, SemiBoldText, RegularText } from '../components/StyledText';
import { connectDrawerButton } from '../Navigation';
import { Colors, FontSizes, Layout } from '../constants';
import { Speakers, Talks } from '../data';
import {
  HideWhenConferenceHasStarted,
  HideWhenConferenceHasEnded,
  ShowWhenConferenceHasEnded,
} from '../utils';
import ContactCard from '../components/ContactCard';
import GET_ATTENDEES from '../data/attendeesquery';
import CachedImage from '../components/CachedImage';

export const Schedule = require('../data/schedule.json');
const Event = Schedule.events[0];

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
    tickets: [],
    attendees: [],
    query: '',
  };

  async getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:tickets');
      this.setState({ tickets: JSON.parse(value) });
    } catch (err) {
      console.log(err);
    }
  }

  constructor(props) {
    super(props);
    this.tickets = [];
  }

  componentDidMount() {
    this.getTickets();
    if (this.state.ready) {
      return;
    }

    setTimeout(() => {
      this.setState({ ready: true });
    }, 200);
  }

  _renderHeader = () => (
    <TextInput
      onChangeText={text => this.setState({ query: text })}
      placeholder="Search a conference attendee here"
    />
  );

  _renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText>{section.title}</RegularText>
      </View>
    );
  };

  _renderItem = ({ item: attendee }) => (
    <ContactCard key={attendee.id} contact={attendee} tickets={this.state.tickets} />
  );

  render() {
    if (!this.state.ready) {
      return null;
    }
    const { query } = this.state;
    const cleanedQuery = query.toLowerCase().trim();

    // <MyContacts
    //   tickets={this.state.tickets}
    //   style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 2 }}
    // />
    // {tix && tix.length > 0 ? (
    //   <ClipBorderRadius>
    //     <RectButton
    //       style={styles.bigButton}
    //       onPress={this._handlePressQRButton}
    //       underlayColor="#fff">
    //       <SemiBoldText style={styles.bigButtonText}>
    //         Scan a contact badge's QR code
    //       </SemiBoldText>
    //     </RectButton>
    //   </ClipBorderRadius>
    // ) : (
    //   <ClipBorderRadius>
    //     <RectButton
    //       style={styles.bigButton}
    //       onPress={this._handlePressProfileQRButton}
    //       underlayColor="#fff">
    //       <SemiBoldText style={styles.bigButtonText}>
    //         You need to scan your ticket first
    //       </SemiBoldText>
    //     </RectButton>
    //   </ClipBorderRadius>
    // )}

    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <Query query={GET_ATTENDEES}>
          {({ loading, error, data }) => {
            if (loading) {
              return <Text>Loading...</Text>;
            }
            if (error) {
              return <Text>Error ${error}</Text>;
            }
            const attendees = data && data.events && data.events[0] ? data.events[0].attendees : [];
            const filteredAttendees = attendees.filter(attendee =>
              attendee.firstName
                .toLowerCase()
                .trim()
                .includes(cleanedQuery)
            );
            console.log('filteredAttendees', filteredAttendees);
            return (
              <React.Fragment>
                <SectionList
                  renderScrollComponent={props => <ScrollView {...props} />}
                  stickySectionHeadersEnabled={true}
                  ListHeaderComponent={this._renderHeader}
                  renderItem={this._renderItem}
                  renderSectionHeader={this._renderSectionHeader}
                  sections={[
                    { title: 'Name', data: filteredAttendees },
                    { title: 'Twitter', data: filteredAttendees },
                    { title: 'Email', data: filteredAttendees },
                  ]}
                  keyExtractor={item => item.id}
                  initialNumToRender={10}
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
  textInput: {},
});

export default Attendees;
