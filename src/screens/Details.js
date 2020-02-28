import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import WebView from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import * as Haptic from 'expo-haptics';
import Constants from 'expo-constants';
import FadeIn from 'react-native-fade-in-image';
import {View as AnimatableView} from 'react-native-animatable';

import AnimatedScrollView from '../components/AnimatedScrollView';
import NavigationBar from '../components/NavigationBar';
import {Colors, FontSizes, Layout} from '../constants';
import {RegularText, BoldText, SemiBoldText} from '../components/StyledText';
import {getSpeakerTalk, convertUtcDateToEventTimezoneHour} from '../utils';
import SaveButton from '../components/SaveButton';
import CachedImage from '../components/CachedImage';
import CloseButton from '../components/CloseButton';
import Markdown from 'react-native-markdown-renderer';

class SavedButtonNavigationItem extends React.Component {
  render() {
    const {talk} = this.props;

    return (
      <View
        style={{
          // gross dumb things
          paddingTop: Platform.OS === 'android' ? 30 : 0,
          marginTop: Layout.notchHeight > 0 ? -5 : 0,
        }}>
        <SaveButton talk={talk} />
      </View>
    );
  }
}

export default class Details extends React.Component {
  static navigationOptions = {
    gesturesEnabled: false,
  };

  state = {
    scrollY: new Animated.Value(0),
  };

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this._listener = this.state.scrollY.addListener(({value}) => {
        if (value < -150) {
          Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
          this.props.navigation.goBack();
          if (this._listener) {
            this.state.scrollY.removeListener(this._listener);
            this._listener = null;
          }
        }
      });
    }
  }

  render() {
    let params = this.props.navigation.state.params || {};
    let speaker;
    let speakers;
    let talk;
    const talkScreen = params.scheduleSlot || params.talk;
    if (talkScreen) {
      talk = params.scheduleSlot || params.talk;
      speakers = talk.speakers;
    } else if (params.speaker) {
      speaker = params.speaker;
      if (speaker.talks && speaker.talks.length > 0) {
        talk = getSpeakerTalk(speaker);
      }
    }

    const {scrollY} = this.state;
    const scale = scrollY.interpolate({
      inputRange: [-300, 0, 1],
      outputRange: [2, 1, 1],
      extrapolate: 'clamp',
    });
    const translateX = 0;
    const translateY = scrollY.interpolate({
      inputRange: [-300, 0, 1],
      outputRange: [-50, 1, 1],
      extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 30, 200],
      outputRange: [0, 0, 1],
    });

    const videoURL = talk && talk.youtubeId && talk.youtubeId !== '';
    return (
      <View style={{flex: 1, backgroundColor: '#fff', overflow: 'hidden'}}>
        {Platform.OS === 'ios' ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: -350,
              left: 0,
              right: 0,
              height: 400,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1, 0, 0],
                  }),
                },
              ],
              backgroundColor: Colors.blue,
            }}
          />
        ) : null}
        <AnimatedScrollView
          style={{flex: 1, backgroundColor: 'transparent'}}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}},
              },
            ],
            {useNativeDriver: true}
          )}>
          <View style={styles.headerContainer}>
            <Animated.View
              style={{
                transform: [{scale}, {translateX}, {translateY}],
              }}>
              <FadeIn placeholderStyle={{backgroundColor: 'transparent'}}>
                {talkScreen ? (
                  <View style={styles.headerRowSpeaker}>
                    {speakers
                      ? speakers.map(speaker => (
                          <View
                            key={speaker.id}
                            style={styles.headerColumnSpeaker}>
                            <TouchableOpacity
                              key={speaker.id}
                              onPress={() => this._handlePressSpeaker(speaker)}>
                              <CachedImage
                                source={{uri: speaker.avatarUrl}}
                                style={styles.avatarMultiple}
                                key={speaker.id + talk.title}
                              />
                            </TouchableOpacity>
                            {speaker.name.split(' ').map((name, index) => (
                              <View key={index}>
                                <TouchableOpacity
                                  key={speaker.id}
                                  onPress={() =>
                                    this._handlePressSpeaker(speaker)
                                  }>
                                  <SemiBoldText
                                    style={styles.headerText}
                                    key={'speakers' + speaker.id + name}>
                                    {name}
                                  </SemiBoldText>
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        ))
                      : null}
                  </View>
                ) : (
                  <CachedImage
                    source={{uri: speaker.avatarUrl}}
                    style={styles.avatar}
                    key={speaker.avatarUrl}
                  />
                )}
              </FadeIn>
            </Animated.View>
            {talkScreen ? null : (
              <SemiBoldText style={styles.headerText} key={speaker.id}>
                {speaker.name}
              </SemiBoldText>
            )}
            {speaker && speaker.twitter ? (
              <TouchableOpacity
                onPress={() =>
                  this._handlePressSpeakerTwitter(speaker.twitter)
                }>
                <RegularText style={styles.headerText}>
                  @{speaker.twitter}
                </RegularText>
              </TouchableOpacity>
            ) : null}
            {talk ? (
              <BoldText style={styles.talkTitleText}>{talk.title}</BoldText>
            ) : null}
          </View>
          {videoURL ? (
            <View style={styles.videoWrapper}>
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${talk.youtubeId}`,
                }}
                startInLoadingState
                scalesPageToFit
                javaScriptEnabled
                style={{flex: 1, height: 240}}
              />
            </View>
          ) : null}
          <AnimatableView
            animation="fadeIn"
            useNativeDriver
            delay={Platform.OS === 'ios' ? 50 : 150}
            duration={500}
            style={styles.content}>
            {talkScreen ? null : (
              <View>
                <SemiBoldText style={styles.sectionHeader}>Bio</SemiBoldText>
                <Markdown styles={markdownStyles}>{speaker.bio}</Markdown>
              </View>
            )}
            {talk ? (
              <SemiBoldText style={styles.sectionHeader}>
                {talk && talk.type === 0 ? 'Talk description' : null}
                {talk && talk.type === 1 ? 'Workshop description' : null}
                {talk && talk.type === 6 ? 'Panel description' : null}
                {talk && talk.type !== 6 && talk.type !== 0 && talk.type !== 1
                  ? 'Description'
                  : null}
              </SemiBoldText>
            ) : null}
            {talk ? (
              <Markdown styles={markdownStyles}>
                {talk.description.replace(
                  '**Click here to see covered subjects**',
                  ''
                )}
              </Markdown>
            ) : null}
            {talkScreen && speakers.length > 0 ? (
              <View>
                <SemiBoldText style={styles.sectionHeader}>
                  {talk.type === 1 ? 'Trainers' : 'Speakers'}
                </SemiBoldText>

                {speakers.map(speaker => (
                  <View key={speaker.id}>
                    <SemiBoldText key={speaker.id + talk.title}>
                      {speaker.name}
                    </SemiBoldText>
                    <Markdown styles={markdownStyles}>{speaker.bio}</Markdown>
                  </View>
                ))}
              </View>
            ) : null}
            {talk ? (
              <View>
                <SemiBoldText style={styles.sectionHeader}>Time</SemiBoldText>
                <RegularText>
                  {convertUtcDateToEventTimezoneHour(talk.startDate)}
                </RegularText>
                <RegularText>{talk.room}</RegularText>
              </View>
            ) : null}
          </AnimatableView>
        </AnimatedScrollView>

        <NavigationBar
          animatedBackgroundOpacity={headerOpacity}
          style={[
            Platform.OS === 'android'
              ? {height: Layout.headerHeight + Constants.statusBarHeight}
              : null,
          ]}
          renderLeftButton={() => (
            <View
              style={{
                // gross dumb things
                paddingTop: Platform.OS === 'android' ? 30 : 0,
                marginTop: Layout.notchHeight > 0 ? -5 : 0,
              }}>
              <CloseButton
                onPress={() => this.props.navigation.goBack()}
                tintColor="#fff"
                title={null}
              />
            </View>
          )}
          renderRightButton={() => {
            talk ? <SavedButtonNavigationItem talk={talk} /> : null;
          }}
        />
      </View>
    );
  }

  _renderTruncatedFooter = handlePress => {
    return (
      <TouchableOpacity
        hitSlop={{top: 15, left: 15, right: 15, bottom: 15}}
        onPress={handlePress}>
        <SemiBoldText style={{color: Colors.blue, marginTop: 5}}>
          Read more
        </SemiBoldText>
      </TouchableOpacity>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <TouchableOpacity
        hitSlop={{top: 15, left: 15, right: 15, bottom: 15}}
        onPress={handlePress}>
        <SemiBoldText style={{color: Colors.blue, marginTop: 5}}>
          Show less
        </SemiBoldText>
      </TouchableOpacity>
    );
  };

  _handlePressSpeaker = speaker => {
    this.props.navigation.navigate('Details', {speaker});
  };

  _handlePressSpeakerTwitter = async twitter => {
    try {
      await Linking.openURL(`twitter://user?screen_name=` + twitter);
    } catch (e) {
      WebBrowser.openBrowserAsync('https://twitter.com/' + twitter);
    }
  };
}
const markdownStyles = {
  // text: {},
};

const styles = StyleSheet.create({
  container: {},
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
  markdownBio: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: 300,
    height: 200,
  },
  markdownTalkDescription: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: 300,
    height: 600,
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
    backgroundColor: Colors.blue,
    paddingTop: Constants.statusBarHeight + Layout.notchHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: FontSizes.subtitle,
  },
  talkTitleText: {
    color: '#fff',
    fontSize: FontSizes.title,
    textAlign: 'center',
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: FontSizes.bodyTitle,
    marginTop: 15,
    marginBottom: 3,
  },
  videoWrapper: {},
});
