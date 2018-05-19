import React from "react";
import { Platform, StyleSheet, View, Linking } from "react-native";
import { WebBrowser } from "expo";
import { withNavigation } from "react-navigation";
import GravatarImage from '../components/GravatarImage';
import { BoldText, RegularText, SemiBoldText } from "./StyledText";
import { sendEmail, openTwitter, getContactTwitter } from "../utils";
import { Colors, FontSizes } from "../constants";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Title,
  Paragraph
} from "react-native-paper";

@withNavigation
export default class ContactCard extends React.Component {
  render() {
    const { contact, onPress } = this.props;
    const { email } = contact;
    const bio = this.getContactBio();
    const twitter = getContactTwitter(contact);
    return (
      <RectButton onPress={() => onPress({ ...contact, bio, twitter })}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <GravatarImage
            style={styles.avatarImage}
            email={contact.email}
          />
          <View style={{flex: 1}}>
            <CardContent>
              <Title>{contact.firstName + " " + contact.lastName}</Title>
              {bio === "" ? null : <Paragraph>{bio}</Paragraph>}
            </CardContent>
            <CardActions>
              {twitter !== "" ? (
                <Button onPress={this._handlePressTwitterButton}>@{twitter}</Button>
              ) : null}
              <Button onPress={this._handlePressEmailButton}>{email}</Button>
            </CardActions>
          </View>
        </View>
      </RectButton>
    );
  }
  _handlePressTwitterButton = () => {
    const twitter = getContactTwitter(this.props.contact);
    openTwitter(twitter);
  };

  _handlePressEmailButton = () => {
    const contact = this.props.contact;
    const emailTo = contact.email;
    const { tickets } = this.props;
    let fromName = { firstName: "", lastName: "" };
    if (tickets && tickets[0] && tickets[0].firstName) {
      fromName = tickets[0];
    }
    sendEmail(emailTo, fromName);
  };
  getContactBio = () => {
    let contact = this.props.contact;
    let bio = "";
    if (contact) {
      contact.answers.map(answer => {
        if (answer.question && answer.question.id === 56) {
          bio = answer.value;
        }
      });
    }
    return bio;
  };
}
const styles = StyleSheet.create({
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: 8,
    marginTop: 8
  },
  headerRow: {
    flexDirection: "row"
  },
  headerRowAvatarContainer: {
    paddingRight: 10
  },
  headerRowInfoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: 5
  },
  speakerName: {
    fontSize: FontSizes.bodyTitle
  },
  organizationName: {
    color: Colors.faint,
    fontSize: FontSizes.bodyLarge
  },
  ticketInfoRow: {
    paddingTop: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  ticketTitle: {
    fontSize: FontSizes.bodyTitle
  },
  ticketLocation: {
    fontSize: FontSizes.bodyLarge,
    color: Colors.faint,
    marginTop: 10
  },
  nextYear: {
    textAlign: "center",
    fontSize: FontSizes.title,
    marginVertical: 10
  },
  button: {
    padding: 15,
    ...Platform.select({
      ios: {
        borderRadius: 5,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 2, height: 2 }
      },
      android: {
        backgroundColor: "#fff",
        elevation: 2
      }
    })
  }
});
