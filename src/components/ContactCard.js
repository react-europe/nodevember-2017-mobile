import React from "react";
import { Platform, StyleSheet, View, Linking } from "react-native";
import { WebBrowser } from "expo";
import { withNavigation } from "react-navigation";
import GravatarImage from '../components/GravatarImage';
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
    const { contact } = this.props;
    const bio = this.getContactBio();
    const twitter = this.getContactTwitter();
    return (
      <Card>
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
              <Button onPress={this._handlePressEmailButton}>Email</Button>
            </CardActions>
          </View>
        </View>
      </Card>
    );
  }
  _handlePressTwitterButton = async () => {
    const twitter = this.getContactTwitter();
    try {
      await Linking.openURL(`twitter://user?screen_name=` + twitter);
    } catch (e) {
      WebBrowser.openBrowserAsync("https://twitter.com/" + twitter);
    }
  };

  _handlePressEmailButton = () => {
    const contact = this.props.contact;
    const email = contact.email;
    const { tickets } = this.props;
    let me = { firstName: "", lastName: "" };
    if (tickets && tickets[0] && tickets[0].firstName) {
      me = tickets[0];
    }
    const emailurl =
      "mailto:" +
      email +
      "?subject=hey it's" +
      " " +
      me.firstName +
      " " +
      me.lastName +
      " " +
      "from ReactEurope&body=ping";
    try {
      Platform.OS === "android"
        ? WebBrowser.openBrowserAsync(emailurl)
        : Linking.openURL(emailurl);
    } catch (e) {
      WebBrowser.openBrowserAsync("mailto:" + email);
    }
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
  getContactTwitter = () => {
    let contact = this.props.contact;
    let twitter = "";
    if (contact) {
      contact.answers.map(answer => {
        if (answer.question && answer.question.title === "Twitter") {
          twitter = answer.value;
        }
      });
    }
    return twitter
      .replace("@", "")
      .replace("https://twitter.com/", "")
      .replace("twitter.com/", "");
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
