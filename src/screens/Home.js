import React from "react";
import {
  Animated,
  Linking,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  View
} from "react-native";
import { WebBrowser, Notifications } from "expo";
import { RectButton } from "react-native-gesture-handler";
import { NavigationActions } from "react-navigation";
import { View as AnimatableView } from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";

import AnimatedScrollView from "../components/AnimatedScrollView";
import NavigationBar from "../components/NavigationBar";
import TalksUpNext from "../components/TalksUpNext";
import MenuButton from "../components/MenuButton";
import { SemiBoldText } from "../components/StyledText";
import { Colors, FontSizes, Layout } from "../constants";
import {
  HideWhenConferenceHasEnded,
  ShowWhenConferenceHasEnded
} from "../utils";
export const Schedule = require("../data/schedule.json");
const Event = Schedule.events[0];

class Home extends React.Component {
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
          >
            <Image
              source={require("../assets/logo.png")}
              style={{ width: 220, height: 60, resizeMode: "contain" }}
              tintColor="#fff"
            />
            <View style={styles.headerContent}>
              <ShowWhenConferenceHasEnded>
                <SemiBoldText style={styles.headerText}>
                  Thank you for joining us!
                </SemiBoldText>
                <SemiBoldText style={styles.headerTextSmall}>
                  See you in May, 2019!
                </SemiBoldText>
              </ShowWhenConferenceHasEnded>

              <HideWhenConferenceHasEnded>
                <SemiBoldText style={styles.headerText}>
                  May 17th to 18th (Conference)
                </SemiBoldText>
                <SemiBoldText style={styles.headerText}>
                  May 15th to 16th (Workshops)
                </SemiBoldText>
                <SemiBoldText style={styles.headerText}>
                  Paris, France
                </SemiBoldText>
              </HideWhenConferenceHasEnded>
            </View>
          </View>

          <DeferredHomeContent />
          <OverscrollView />
        </AnimatedScrollView>

        <NavigationBar animatedBackgroundOpacity={headerOpacity} />
      </View>
    );
  }

  _openTickets = () => {
    Linking.openURL(Event.websiteUrl + "#tickets");
  };
}

@withNavigation
class DeferredHomeContent extends React.Component {
  state = {
    ready: Platform.OS === "android" ? false : true,
    hasCameraPermission: null,
    Notification: {},
    tickets: []
  };

  async getTickets() {
    try {
      const value = await AsyncStorage.getItem("@MySuperStore:tickets");
      // console.log("tickets", value);
      this.setState({ tickets: JSON.parse(value) });
      this.tickets = JSON.parse(value);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.getTickets();
  }

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );

    if (this.state.ready) {
      return;
    }
    setTimeout(() => {
      this.setState({ ready: true });
    }, 200);
  }
  _handleNotification = notification => {
    this.setState({ notification: notification });
    if (notification && notification.data && notification.data.url) {
      WebBrowser.openBrowserAsync(notification.data.url);
    }
  };
  render() {
    if (!this.state.ready) {
      return null;
    }
    const tix = this.state.tickets || [];
    let isStaff = false;
    tix.map(ticket => {
      if (ticket && ticket.type === 4) {
        isStaff = true;
      }
    });
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        {isStaff ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressStaffCheckinListsButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                Go to checkin
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length === 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                Scan your conference ticket QR code
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length > 0 && !isStaff ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={() => this.props.navigation.navigate("Profile")}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                My tickets
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}

        <TalksUpNext
          style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 2 }}
        />
        <View style={{ marginHorizontal: 15, marginBottom: 20 }}>
          <TouchableOpacity onPress={this._handlePressAllTalks}>
            <SemiBoldText style={styles.seeAllTalks}>
              See all talks →
            </SemiBoldText>
          </TouchableOpacity>
        </View>
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={() => this.props.navigation.navigate("Profile")}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                My Tickets
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length === 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                Scan your conference ticket QR code
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                Scan another ticket QR code
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : null}
        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressCOCButton}
            underlayColor="#fff"
          >
            <SemiBoldText style={styles.bigButtonText}>
              Read the code of conduct
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>

        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressMapButton}
            underlayColor="#fff"
          >
            <SemiBoldText style={styles.bigButtonText}>
              {Platform.OS === "android" ? "Download" : "Open"} the conference
              map
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>

        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressTwitterButton}
            underlayColor="#fff"
          >
            <Ionicons
              name="logo-twitter"
              size={23}
              style={{
                color: "#fff",
                marginTop: 3,
                backgroundColor: "transparent",
                marginRight: 5
              }}
            />
            <SemiBoldText style={styles.bigButtonText}>
              @{Event.twitterHandle}
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      </AnimatableView>
    );
  }

  _handlePressAllTalks = () => {
    this.props.navigation.dispatch(
      NavigationActions.navigate({
        routeName: "Schedule"
      })
    );
  };

  _handlePressCOCButton = () => {
    WebBrowser.openBrowserAsync(Event.cocUrl);
  };

  _handlePressQRButton = () => {
    this.props.navigation.navigate({
      routeName: "QRScanner",
      key: "QRScanner"
    });
  };

  _handlePressStaffCheckinListsButton = () => {
    // console.log("handle press checkinlists");
    this.props.navigation.navigate("StaffCheckinLists");
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

  _handlePressMapButton = () => {
    const params = encodeURIComponent(
      Event.venueName + Event.venueCity + "," + Event.venueCountry
    );
    WebBrowser.openBrowserAsync("https://www.google.com/maps/search/" + params);
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

export default Home;
