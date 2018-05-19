import React from "react";

import {
  Animated,
  Linking,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  View
} from "react-native";
import FadeIn from "react-native-fade-in-image";
import { ScrollView } from "react-native-gesture-handler";
import { WebBrowser } from "expo";

import { Colors, FontSizes, Layout } from "../constants";
import MenuButton from "../components/MenuButton";
import { BoldText, SemiBoldText, RegularText } from "../components/StyledText";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import CachedImage from "../components/CachedImage";
import SearchAttendees from "../components/SearchAttendees";
import { RectButton } from "react-native-gesture-handler";

export default class Attendees extends React.Component {
  static navigationOptions = {
    title: "Attendees",
    headerStyle: { backgroundColor: Colors.blue },
    headerTintColor: "white",
    headerLeft: <MenuButton />,
    headerTitleStyle: {
      fontFamily: "open-sans-bold"
    }
  };

  state = {
    ready: Platform.OS === "android" ? false : true,
    uuid: null
  };

  async getUUID() {
    try {
      const value = await AsyncStorage.getItem("@MySuperStore:tickets");
      const tickets = JSON.parse(value);
      const tix = tickets || [];
      const uuid = tix.length > 0 && tickets[0].uuid;

      this.setState({ uuid });
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getUUID();
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

    const { uuid } = this.state;

    if (uuid) {
      return (
        <SearchAttendees
          uuid={uuid}
          onPressAttendee={attendee => {
            this._handlePressAttendee(attendee);
          }}
        />
      );
    } else {
      return (
        <View>
          <RectButton
            style={styles.bigButton}
            onPress={this._handlePressProfileQRButton}
            underlayColor="#fff"
          >
            <SemiBoldText style={styles.bigButtonText}>
              You need to scan your ticket first
            </SemiBoldText>
          </RectButton>
        </View>
      );
    }
  }

  _handlePressProfileQRButton = () => {
    this.props.navigation.navigate({
      routeName: "QRScanner",
      key: "QRScanner"
    });
  };

  _handlePressAttendee = attendee => {
    this.props.navigation.navigate("AttendeeDetails", { attendee });
  };
}

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
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
  }
});
