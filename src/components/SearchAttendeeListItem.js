import React from "react";
import { Image, Platform, StyleSheet, View, Linking } from "react-native";
import { Svg, FileSystem, WebBrowser } from "expo";
import { RectButton } from "react-native-gesture-handler";
import FadeIn from "react-native-fade-in-image";
import { withNavigation } from "react-navigation";
import GravatarImage from "../components/GravatarImage";
import SaveIconWhenSaved from "./SaveIconWhenSaved";
import { BoldText, RegularText, SemiBoldText } from "./StyledText";
import { conferenceHasEnded, getSpeakerAvatarURL } from "../utils";
import { Colors, FontSizes } from "../constants";

import {
  Card,
  CardActions,
  CardContent,
  Title,
  Paragraph
} from "react-native-paper";

//@withNavigation
export default class SearchAttendeeListItem extends React.Component {
  render() {
    const { contact, onPress } = this.props;
    const { firstName, lastName, email } = contact;

    return (
      <RectButton
        onPress={() => onPress(contact)}
        activeOpacity={0.05}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <GravatarImage style={styles.avatarImage} email={email} />
          <View style={styles.listItemTitle}>
            <Title>{firstName + " " + lastName}</Title>
          </View>
        </View>
      </RectButton>
    );
  }
}

const styles = StyleSheet.create({
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: 8,
    marginTop: 8
  },
  listItemTitle: {
    flex: 1,
    height: 64,
    justifyContent: "center",
    marginLeft: 8,
    marginTop: 8
  }
});
