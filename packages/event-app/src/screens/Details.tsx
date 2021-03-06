import {Ionicons} from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, {useState, useContext} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Linking,
  Dimensions,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import Markdown from 'react-native-markdown-renderer';
import {Theme, useTheme} from 'react-native-paper';
import WebView from 'react-native-webview';

import CachedImage from '../components/CachedImage';
import {RegularText, BoldText, SemiBoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {Talk, Speaker, Schedule} from '../typings/data';
import {AppProps} from '../typings/navigation';
import {getSpeakerTalk, convertUtcDateToEventTimezoneHour} from '../utils';

/* function SavedButtonNavigationItem(props: {talk: Talk}) {
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
} */

export default function Details(props: AppProps<'Details'>) {
  const {width, height} = Dimensions.get('window');
  const data = useContext(DataContext);
  const theme: Theme = useTheme();
  const [scrollY] = useState(new Animated.Value(0));
  const [titleWidth, setTitleWidth] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [animate, setAnimate] = useState(false);
  /*   let _listener: string | null = null;
  

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
    outputRange: [80, animate ? 40 : 80],
    extrapolate: 'clamp',
  });

  const ImageLeft = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [
      width / 2 - speakers.length * 40,
      animate ? 30 : width / 2 - speakers.length * 40,
    ],
    extrapolate: 'clamp',
  });

  const ImageY = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [0, animate ? -40 : 0],
    extrapolate: 'clamp',
  });

  const TitleY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, animate ? -1000 : 0],
    extrapolate: 'clamp',
  });

  const TitleX = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [width, animate ? speakers.length * 42 + 40 : width],
    extrapolate: 'clamp',
  });

  const AnimateHeaderHeight = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [headerHeight, animate ? 44 : headerHeight],
    extrapolate: 'clamp',
  });

  const NameWidth = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [80, animate ? 0 : 80],
    extrapolate: 'clamp',
  });

  const NameHeight = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [20, animate ? 0 : 20],
    extrapolate: 'clamp',
  });

  function onLayoutTitle(event: LayoutChangeEvent) {
    setTitleWidth(event.nativeEvent.layout.width);
  }

  function onLayoutHeader(event: LayoutChangeEvent) {
    if (headerHeight === 0) {
      setHeaderHeight(event.nativeEvent.layout.height);
    }
  }

  function onLayoutContent(event: LayoutChangeEvent) {
    if (event.nativeEvent.layout.height >= height + 140) {
      setAnimate(true);
    }
  }

  let littleTitle = '';
  if (talk?.title) {
    const topBarWidth = speakers.length * 42 + 44;
    if (titleWidth + topBarWidth > width) {
      littleTitle = talk.title.substr(0, 28 - speakers.length * 4) + '...';
    } else {
      littleTitle = talk.title;
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
                        margin: 2,
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
                  {speaker.name?.split(' ').map((name, index) => (
                    <Animated.View
                      key={index}
                      style={{width: NameWidth, height: NameHeight}}>
                      <SemiBoldText
                        TextColorAccent
                        style={{
                          fontSize: 14,
                          alignSelf: 'center',
                          transform: [{translateX: ImageLeft}],
                        }}
                        animated>
                        {name}
                      </SemiBoldText>
                    </Animated.View>
                  ))}
                </View>
              ))
            : null}
        </View>
        {talk ? (
          <>
            <BoldText
              style={[
                styles.talkTitleText,
                {transform: [{translateY: TitleY}]},
              ]}
              fontSize="lg"
              TextColorAccent
              onLayout={onLayoutTitle}
              animated>
              {talk.title}
            </BoldText>
            <BoldText
              style={[
                {
                  transform: [{translateX: TitleX}, {translateY: 11}],
                  position: 'absolute',
                },
              ]}
              fontSize="lg"
              TextColorAccent
              animated>
              {littleTitle}
            </BoldText>
          </>
        ) : null}
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
        <View
          onLayout={onLayoutContent}
          style={{paddingTop: headerHeight + 20}}>
          {videoURL ? (
            <View>
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${videoURL}`,
                }}
                startInLoadingState
                scalesPageToFit
                javaScriptEnabled
                style={{flex: 1, height: 240}}
              />
            </View>
          ) : null}
          <View style={styles.content}>
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
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  sectionHeader: {
    marginTop: 15,
    marginBottom: 3,
  },
});
