import React from "react";
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  AsyncStorage,
  View
} from "react-native";
import { WebBrowser } from "expo";
import { RectButton } from "react-native-gesture-handler";
import { View as AnimatableView } from "react-native-animatable";
import { withNavigation } from "react-navigation";

import AnimatedScrollView from "../components/AnimatedScrollView";
import MyContacts from "../components/MyContacts";
import NavigationBar from "../components/NavigationBar";
import MenuButton from "../components/MenuButton";
import { SemiBoldText } from "../components/StyledText";
import { Colors, FontSizes, Layout } from "../constants";
export const Schedule = require("../data/schedule.json");
const Event = Schedule.events[0];

class Contacts extends React.Component {
  state = {
    scrollY: new Animated.Value(0)
  };

  render() {
    const { scrollY } = this.state;
    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
      extrapolate: "clamp"
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
                nativeEvent: { contentOffset: { y: scrollY } }
              }
            ],
            { useNativeDriver: true }
          )}
        >
          <View
            style={{
              backgroundColor: "#4d5fab",
              padding: 10,
              paddingTop: Layout.headerHeight - 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          />

          <DeferredContactsContent />
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
class DeferredContactsContent extends React.Component {
  state = {
    ready: Platform.OS === "android" ? false : true,
    tickets: []
  };

  async getTickets() {
    try {
      const value = await AsyncStorage.getItem("@MySuperStore:tickets");
      this.setState({ tickets: JSON.parse(value) });
      this.tickets = JSON.parse(value);
    } catch (err) {
      console.log(err);
      return [];
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

  render() {
    if (!this.state.ready) {
      return null;
    }

    const { tickets } = this.state;
    const tix = tickets || [];
    const uuid = tix.length > 0 && tickets[0].uuid;

    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <MyContacts
          tickets={this.state.tickets}
          style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 2 }}
        />
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                {"Scan a contact badge's QR code"}
              </SemiBoldText>
            </RectButton>
            <SearchAttendees
              uuid={uuid}
              onPressAttendee={attendee => {
                this._handlePressAttendee(attendee);
              }}
            />
          </ClipBorderRadius>
        ) : (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressProfileQRButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                You need to scan your ticket first
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        )}
      </AnimatableView>
    );
  }

  _handlePressQRButton = () => {
    this.props.navigation.navigate({
      routeName: "QRContactScanner",
      key: "QRContactScanner"
    });
  };

  _handlePressProfileQRButton = () => {
    this.props.navigation.navigate({
      routeName: "QRScanner",
      key: "QRScanner"
    });
  };

  _handlePressAttendee = attendee => {
    this.props.navigation.navigate("AttendeeDetails", { attendee });
  };

  _handlePressTwitterButton = async () => {
    try {
      await Linking.openURL(
        `twitter://user?screen_name=` + Event.twitterHandle
      );
    } catch (e) {
      WebBrowser.openBrowserAsync("https://twitter.com/" + Event.twitterHandle);
    }
  };
}

const OverscrollView = () => (
  <View
    style={{
      position: "absolute",
      top: -400,
      height: 400,
      left: 0,
      right: 0,
      backgroundColor: Colors.blue
    }}
  />
);

const ClipBorderRadius = ({ children, style }) => {
  return (
    <View
      style={[
        { borderRadius: BORDER_RADIUS, overflow: "hidden", marginTop: 10 },
        style
      ]}
    >
      {children}
    </View>
  );
};

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
  headerContent: {
    alignItems: "center",
    marginTop: 5,
    paddingVertical: 10
  },
  headerVideoLayer: {
    ...StyleSheet.absoluteFillObject
  },
  headerVideoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.blue,
    opacity: 0.8
  },
  headerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    lineHeight: 17 * 1.5
  },
  headerSmallText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 7,
    lineHeight: 7 * 1.5
  },
  bigButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    flexDirection: "row"
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: "#fff",
    textAlign: "center"
  },
  seeAllTalks: {
    fontSize: FontSizes.normalButton,
    color: Colors.blue
  }
});

export default Contacts;
