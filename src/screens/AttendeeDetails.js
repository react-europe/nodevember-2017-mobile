import React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Linking
} from "react-native";
import { Constants, WebBrowser } from "expo";
import FadeIn from "react-native-fade-in-image";
import { View as AnimatableView } from "react-native-animatable";
import AnimatedScrollView from "../components/AnimatedScrollView";
import NavigationBar from "../components/NavigationBar";
import { Colors, FontSizes, Layout } from "../constants";
import { RegularText, SemiBoldText } from "../components/StyledText";
import GravatarImage from "../components/GravatarImage";
import CloseButton from "../components/CloseButton";
import Markdown from "react-native-simple-markdown";

export default class Details extends React.Component {
  state = {
    scrollY: new Animated.Value(0)
  };

  render() {
    let params = this.props.navigation.state.params || {};
    const { answers, ...rest } = params.attendee;

    const twitter = answers.find(item => item.question.id === 58);
    const bio = answers.find(item => item.question.id === 56);
    const job = answers.find(item => item.question.id === 59);

    const attendee = {
      ...rest,
      twitter: twitter ? twitter.value : null,
      bio: bio ? bio.value : null,
      job: job ? job.value : null
    };

    const { scrollY } = this.state;
    const scale = scrollY.interpolate({
      inputRange: [-300, 0, 1],
      outputRange: [2, 1, 1],
      extrapolate: "clamp"
    });
    const translateX = 0;
    const translateY = scrollY.interpolate({
      inputRange: [-300, 0, 1],
      outputRange: [-50, 1, 1],
      extrapolate: "clamp"
    });

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 30, 200],
      outputRange: [0, 0, 1]
    });

    return (
      <View style={{ flex: 1, backgroundColor: "#fff", overflow: "hidden" }}>
        {Platform.OS === "ios" ? (
          <Animated.View
            style={{
              position: "absolute",
              top: -350,
              left: 0,
              right: 0,
              height: 400,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1, 0, 0]
                  })
                }
              ],
              backgroundColor: Colors.blue
            }}
          />
        ) : null}
        <AnimatedScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this.state.scrollY } }
              }
            ],
            { useNativeDriver: true }
          )}
        >
          <View style={styles.headerContainer}>
            <Animated.View
              style={{
                transform: [{ scale }, { translateX }, { translateY }]
              }}
            >
              <FadeIn placeholderStyle={{ backgroundColor: "transparent" }}>
                <GravatarImage style={styles.avatar} email={attendee.email} />
              </FadeIn>
            </Animated.View>

            <SemiBoldText style={styles.headerText} key={attendee.id}>
              {attendee.firstName + " " + attendee.lastName}
            </SemiBoldText>
          </View>
          <AnimatableView
            animation="fadeIn"
            useNativeDriver
            delay={Platform.OS === "ios" ? 50 : 150}
            duration={500}
            style={styles.content}
          >
            <View>
              {attendee.bio && (
                <View>
                  <SemiBoldText style={styles.sectionHeader}>Bio</SemiBoldText>
                  <Markdown styles={markdownStyles}>{attendee.bio}</Markdown>
                </View>
              )}
              {attendee.job && (
                <View>
                  <SemiBoldText style={styles.sectionHeader}>
                    Job Title
                  </SemiBoldText>
                  <Markdown styles={markdownStyles}>{attendee.job}</Markdown>
                </View>
              )}
              {attendee.twitter && (
                <View>
                  <SemiBoldText style={styles.sectionHeader}>
                    Twitter
                  </SemiBoldText>
                  <TouchableOpacity
                    onPress={() =>
                      this._handlePressSpeakerTwitter(attendee.twitter)
                    }
                  >
                    <RegularText style={styles.twitterText}>
                      {attendee.twitter}
                    </RegularText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </AnimatableView>
        </AnimatedScrollView>

        <NavigationBar
          animatedBackgroundOpacity={headerOpacity}
          style={[
            Platform.OS === "android"
              ? { height: Layout.headerHeight + Constants.statusBarHeight }
              : null
          ]}
          renderLeftButton={() => (
            <View
              style={{
                // gross dumb things
                paddingTop: Platform.OS === "android" ? 30 : 0,
                marginTop: Layout.notchHeight > 0 ? -5 : 0
              }}
            >
              <CloseButton
                onPress={() => this.props.navigation.goBack()}
                tintColor="#fff"
                title={null}
              />
            </View>
          )}
          renderRightButton={() => null}
        />
      </View>
    );
  }

  _renderTruncatedFooter = handlePress => {
    return (
      <TouchableOpacity
        hitSlop={{ top: 15, left: 15, right: 15, bottom: 15 }}
        onPress={handlePress}
      >
        <SemiBoldText style={{ color: Colors.blue, marginTop: 5 }}>
          Read more
        </SemiBoldText>
      </TouchableOpacity>
    );
  };

  _handlePressSpeakerTwitter = async twitter => {
    try {
      await Linking.openURL(`twitter://user?screen_name=` + twitter);
    } catch (e) {
      WebBrowser.openBrowserAsync("https://twitter.com/" + twitter);
    }
  };
}
const markdownStyles = {
  text: {}
};
const styles = StyleSheet.create({
  container: {},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10
  },
  content: {
    backgroundColor: "#fff",
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerContainer: {
    backgroundColor: Colors.blue,
    paddingTop: Constants.statusBarHeight + Layout.notchHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  headerText: {
    color: "#fff",
    fontSize: FontSizes.subtitle
  },
  twitterText: {
    color: "#000",
    fontSize: FontSizes.subtitle
  },
  sectionHeader: {
    fontSize: FontSizes.bodyTitle,
    marginTop: 15,
    marginBottom: 3
  }
});
