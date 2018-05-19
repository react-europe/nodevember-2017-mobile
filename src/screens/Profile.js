import React from "react";
import {
  Animated,
  Linking,
  Platform,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import { Permissions } from "expo";
import { RectButton } from "react-native-gesture-handler";
import { View as AnimatableView } from "react-native-animatable";
import { withNavigation } from "react-navigation";

import AnimatedScrollView from "../components/AnimatedScrollView";
import NavigationBar from "../components/NavigationBar";
import Tickets from "../components/Tickets";
import MenuButton from "../components/MenuButton";
import { SemiBoldText } from "../components/StyledText";
import { Colors, FontSizes, Layout } from "../constants";
export const Schedule = require("../data/schedule.json");
const Event = Schedule.events[0];

class Profile extends React.Component {
  state = {
    scrollY: new Animated.Value(0),
    hasCameraPermission: null
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
          <DeferredProfileContent />
          <OverscrollView />
        </AnimatedScrollView>
      </View>
    );
  }

  _openTickets = () => {
    Linking.openURL(Event.websiteUrl + "#tickets");
  };
}

class DeferredProfileContent extends React.Component {
  state = {
    tickets: [],
    ready: Platform.OS === "android" ? false : true
  };
  async getTickets() {
    try {
      const value = await AsyncStorage.getItem("@MySuperStore:tickets");
      this.setState({ tickets: JSON.parse(value) });
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
    if (this.state.ready) {
      return;
    }

    setTimeout(() => {
      this.setState({ ready: true });
    }, 200);
  }

  render() {
    let tickets = this.state.tickets || [];
    if (!this.state.ready) {
      return null;
    }
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <Tickets
          style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 2 }}
        />

        <ClipBorderRadius>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressQRButton}
            underlayColor="#fff"
          >
            <SemiBoldText style={styles.bigButtonText}>
              {tickets.length > 0
                ? "Scan another ticket QR code"
                : "Scan your ticket QR code"}
            </SemiBoldText>
          </RectButton>
        </ClipBorderRadius>
      </AnimatableView>
    );
  }
  _requestCameraPermission = async () => {
    console.log(1);
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    console.log(2);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  };

  _handlePressQRButton = () => {
    console.log(0);
    this._requestCameraPermission();
    console.log(3);
    Permissions.askAsync(Permissions.CAMERA).then(() => {
      console.log(4);
      this.props.navigation.navigate("QRScanner");
      console.log(5);
      return;
    });
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

export default Profile;
