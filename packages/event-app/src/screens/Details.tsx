import {Ionicons} from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Haptic from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import React, {useEffect, useState, useContext} from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Dimensions,
  Image,
  Animated,
  Text,
} from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import {Theme, useTheme} from 'react-native-paper';
import WebView from 'react-native-webview';

import AnimatedScrollView from '../components/AnimatedScrollView';
import CachedImage from '../components/CachedImage';
import CloseButton from '../components/CloseButton';
import ImageFadeIn from '../components/ImageFadeIn';
import NavigationBar from '../components/NavigationBar';
import SaveButton from '../components/SaveButton';
import {RegularText, BoldText, SemiBoldText} from '../components/StyledText';
import {Layout} from '../constants';
import DataContext from '../context/DataContext';
import {Talk, Speaker, Schedule} from '../typings/data';
import {AppProps} from '../typings/navigation';
import {getSpeakerTalk, convertUtcDateToEventTimezoneHour} from '../utils';

function SavedButtonNavigationItem(props: {talk: Talk}) {
  return (
    <View
      style={{
        // gross dumb things
        paddingTop: Platform.OS === 'android' ? 30 : 0,
        marginTop: Layout.notchHeight > 0 ? -5 : 0,
      }}>
      <SaveButton talk={props.talk} />
    </View>
  );
}

const {width} = Dimensions.get('window');

export default function Details(props: AppProps<'Details'>) {
  const data = useContext(DataContext);
  const theme: Theme = useTheme();
  const [scrollY] = useState(new Animated.Value(0));
  const [titleXPos, setTitleXPos] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  /*   let _listener: string | null = null;

  useEffect(() => {
    if (Platform.OS === 'ios') {
      _listener = scrollY.addListener(({value}) => {
        if (value < -150) {
          Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
          props.navigation.goBack();
          if (_listener) {
            scrollY.removeListener(_listener);
            _listener = null;
          }
        }
      });
    }
    return function unmount() {
      if (_listener) {
        scrollY.removeListener(_listener);
        _listener = null;
      }
    };
  }, []); */

  /* const _renderTruncatedFooter = handlePress => {
    return (
      <TouchableOpacity
        hitSlop={{top: 15, left: 15, right: 15, bottom: 15}}
        onPress={handlePress}>
        <SemiBoldText style={{color: theme.colors.primary, marginTop: 5}}>
          Read more
        </SemiBoldText>
      </TouchableOpacity>
    );
  };

  const _renderRevealedFooter = handlePress => {
    return (
      <TouchableOpacity
        hitSlop={{top: 15, left: 15, right: 15, bottom: 15}}
        onPress={handlePress}>
        <SemiBoldText style={{color: theme.colors.primary, marginTop: 5}}>
          Show less
        </SemiBoldText>
      </TouchableOpacity>
    );
  }; */

  const _handlePressSpeakerTwitter = async (twitter: string) => {
    if (Platform.OS === 'web') {
      WebBrowser.openBrowserAsync('https://twitter.com/' + twitter);
    } else {
      try {
        await Linking.openURL(`twitter://user?screen_name=` + twitter);
      } catch (e) {
        WebBrowser.openBrowserAsync('https://twitter.com/' + twitter);
      }
    }
  };

  function getScheduleSlotById(slotId: number): Schedule | undefined {
    if (data.event?.groupedSchedule) {
      const days = data.event.groupedSchedule.map((day) => {
        if (day?.slots) {
          return day.slots;
        }
      });
      const scheduleSlots = days.flat() as (Schedule | undefined)[];
      const scheduleSlot = scheduleSlots.find((slot) => slot?.id === slotId);
      return scheduleSlot;
    }
  }

  function getSpeakerById(SpeakerId: number): Speaker | undefined | null {
    if (data.event?.speakers) {
      const speaker = data.event.speakers.find(
        (speaker) => speaker?.id === SpeakerId
      );
      return speaker;
    }
  }

  const params = props.route.params || {};
  let speaker: Speaker | null | undefined = null;
  let speakers: Speaker[] = [];
  let talk: Schedule | Talk | undefined = undefined;
  let videoURL: string | null = null;
  let room: string | null = null;
  const talkScreen = params.scheduleId;
  if (talkScreen) {
    if (params.scheduleId) {
      talk = getScheduleSlotById(params.scheduleId);
      if (talk?.speakers && talk.speakers.length > 0) {
        speakers = talk.speakers as Speaker[];
      }
      if (talk?.youtubeId && talk.youtubeId !== '') {
        videoURL = talk.youtubeId;
      }
      if (talk?.room) {
        room = talk.room;
      }
    }
  } else if (params.speakerId) {
    speaker = getSpeakerById(params.speakerId);
    if (speaker?.talks && speaker.talks.length > 0) {
      talk = getSpeakerTalk(speaker);
    }
    if (speaker) {
      speakers = [speaker];
    }
  }

  const getImageWidth = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [80, 40],
    extrapolate: 'clamp',
  });

  const ImageLeft = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [width / 2 - speakers.length * 40, 30],
    extrapolate: 'clamp',
  });

  const ImageY = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const TitleY = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [0, -75],
    extrapolate: 'clamp',
  });

  const TitleX = scrollY.interpolate({
    inputRange: [0, 140],
    // speakers pictures + close Ionicons - title left position
    outputRange: [0, speakers.length * 42 + 40 - titleXPos],
    extrapolate: 'clamp',
  });

  const AnimateHeaderHeight = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [headerHeight, 40],
    extrapolate: 'clamp',
  });

  function onLayoutTitle(event) {
    setTitleXPos(event.nativeEvent.layout.x);
  }

  function onLayoutHeader(event) {
    if (headerHeight === 0) {
      setHeaderHeight(event.nativeEvent.layout.height);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff', overflow: 'hidden'}}>
      <Animated.View
        onLayout={onLayoutHeader}
        style={[
          styles.headerContainer,
          {
            backgroundColor: theme.colors.primary,
            height: headerHeight ? AnimateHeaderHeight : 'auto',
            width,
          },
        ]}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
          size={40}
          onPress={() => props.navigation.goBack()}
          style={{marginLeft: 4}}
          color="#fff"
        />
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          {speakers
            ? speakers.map((speaker, index) => (
                <View key={index}>
                  {speaker.avatarUrl && (
                    <CachedImage
                      source={{uri: speaker.avatarUrl}}
                      style={{
                        borderRadius: 50,
                        marginHorizontal: 1,
                        width: getImageWidth,
                        height: getImageWidth,
                        transform: [
                          {translateX: ImageLeft},
                          {translateY: ImageY},
                        ],
                      }}
                      animated
                    />
                  )}
                  {/* {speaker.name?.split(' ').map((name, index) => (
                    <View key={index}>
                      <TouchableOpacity key={index}>
                        <SemiBoldText fontSize="sm" TextColorAccent>
                          {name}
                        </SemiBoldText>
                      </TouchableOpacity>
                    </View>
                  ))} */}
                </View>
              ))
            : null}
        </View>
        <View style={{paddingHorizontal: 10, alignItems: 'center'}}>
          {talk ? (
            <BoldText
              style={[
                styles.talkTitleText,
                {transform: [{translateX: TitleX}, {translateY: TitleY}]},
              ]}
              onLayout={onLayoutTitle}
              fontSize="lg"
              TextColorAccent
              animated>
              {talk.title}
            </BoldText>
          ) : null}
        </View>
      </Animated.View>

      <Animated.ScrollView
        overScrollMode="never"
        style={{zIndex: 10}}
        scrollEventThrottle={16}
        onScroll={Animated.event([
          {
            nativeEvent: {contentOffset: {y: scrollY}},
          },
        ])}>
        <View style={[styles.content, {paddingTop: headerHeight}]}>
          {!talkScreen && speaker ? (
            <View>
              <SemiBoldText style={styles.sectionHeader} fontSize="md">
                Bio
              </SemiBoldText>
              <Markdown>{speaker.bio}</Markdown>
            </View>
          ) : null}
          {talk ? (
            <SemiBoldText style={styles.sectionHeader} fontSize="md">
              {talk && talk.type === 0 ? 'Talk description' : null}
              {talk && talk.type === 1 ? 'Workshop description' : null}
              {talk && talk.type === 6 ? 'Panel description' : null}
              {talk && talk.type !== 6 && talk.type !== 0 && talk.type !== 1
                ? 'Description'
                : null}
            </SemiBoldText>
          ) : null}
          {talk?.description ? (
            <Markdown>
              {talk.description.replace(
                '**Click here to see covered subjects**',
                ''
              )}
            </Markdown>
          ) : null}
          {talkScreen && speakers?.length > 0 && talk ? (
            <View>
              <SemiBoldText style={styles.sectionHeader} fontSize="md">
                {talk.type === 1 ? 'Trainers' : 'Speakers'}
              </SemiBoldText>

              {speakers.map((speaker, index) => (
                <View key={index}>
                  <SemiBoldText>{speaker.name}</SemiBoldText>
                  <Markdown>{speaker.bio}</Markdown>
                </View>
              ))}
            </View>
          ) : null}
          {room && talk ? (
            <View>
              <SemiBoldText style={styles.sectionHeader} fontSize="md">
                Time
              </SemiBoldText>
              <RegularText>
                {convertUtcDateToEventTimezoneHour(talk.startDate)}
              </RegularText>
              <RegularText fontSize="sm">{room}</RegularText>
            </View>
          ) : null}
        </View>
        {/*         <View
          style={{
            height: 1200,
            backgroundColor: 'salmon',
            alignItems: 'center',
          }}
        /> */}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  avatarMultiple: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  content: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRowSpeaker: {
    flexDirection: 'row',
    height: 140,
  },
  headerColumnSpeaker: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  headerContainer: {
    top: 0,
    zIndex: 200,
    position: 'absolute',
    overflow: 'hidden',
  },
  talkTitleText: {
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 15,
    marginBottom: 3,
  },
});
