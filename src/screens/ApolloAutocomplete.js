import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SectionList,
  Linking,
  Platform,
} from "react-native";
import { ScrollView, RectButton } from "react-native-gesture-handler";
import { BoldText, SemiBoldText, RegularText } from '../components/StyledText';

import {
  graphql
} from 'react-apollo';
import gql from 'graphql-tag';
import Downshift from 'downshift'
import {WebBrowser} from "expo";
import {Colors, FontSizes} from "../constants";
import { Ionicons } from "@expo/vector-icons";

class ApolloAutocomplete extends React.Component {
  render() {
    return (
      <Downshift>
        {({
            getInputProps,
            inputValue,
            getRootProps,
          }) =>
          <View {...getRootProps({refKey: 'ref'}, {suppressRefError: true})}>
            <ApolloAutocompleteListWithData
              {...{
                getInputProps,
                inputValue,
              }}
            />
          </View>}
      </Downshift>
    )
  }
}

class ApolloAutocompleteList extends React.Component {
  _renderItem = ({ item, index }) => {

    return <AttendeeRow item={item} index={index} />;
  };

  _renderSectionHeader = ({ section }) => {
    const {getInputProps} = this.props;

    const customProps = {...getInputProps()};
    // Super hack for https://github.com/paypal/downshift/issues/334
    customProps.onBlur = null;

    return (
      <View style={styles.sectionHeader}>
        <TextInput {...customProps} autoFocus style={styles.textInput} />
      </View>
    );
  };

  render() {
    const {data: {events, loading}} = this.props;

    const AttendeesData = [{ data: events && events[0] && events[0].attendees || [], loading }];

    return (
      <SectionList
        renderScrollComponent={props => <ScrollView {...props} />}
        stickySectionHeadersEnabled={true}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        sections={AttendeesData}
        keyExtractor={(item, index) => index.toString()}
      />);
  }
}

class AttendeeRow extends React.Component {
  _getExtraInfo = () => {
    const {answers} = this.props.item;

    return answers.reduce((acc, cur) => {
      if (!cur || !cur.value || !cur.question) {
        return acc;
      }

      switch (cur.question.id) {
        case 56:
          acc.activity = cur.value;
          break;
        case 58:
          acc.twitter = cur.value.replace('@', '');
          break;
        case 59:
          acc.jobTitle = cur.value;
          break;
      }

      return acc;
    }, {});
  };

  _handlePressTwitterButton = async (twitter) => {
    try {
      await Linking.openURL(
        `twitter://user?screen_name=` + twitter
      );
    } catch (e) {
      WebBrowser.openBrowserAsync("https://twitter.com/" + twitter);
    }
  };

  _handlePressEmailButton = async (email) => {
    let me = { firstName: "", lastName: "" };
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
        : await Linking.openURL(emailurl);
    } catch (e) {
      WebBrowser.openBrowserAsync("mailto:" + email);
    }
  };

  render() {
    const {index, item} = this.props;
    const {firstName, lastName, email} = item;
    const {twitter, jobTitle, activity} = this._getExtraInfo();

    return (
      <View style={styles.rowContainer, {backgroundColor: index % 2 === 0 ? '#fff' : '#eee'}}>
        <View style={styles.textArea}>
          <BoldText style={styles.rowText}>{firstName + ' ' + lastName}</BoldText>
          {jobTitle ? <RegularText style={{marginBottom: 10}}>{jobTitle}</RegularText> : null}
          {activity ? <RegularText style={{marginBottom: 10}}>{activity}</RegularText> : null}
        </View>
        {email &&
          <RectButton style={[styles.button, {marginBottom: 10}]} underlayColor="#fff" onPress={this._handlePressEmailButton.bind(null, email)}>
            <Ionicons
              name="ios-mail"
              size={23}
              style={{
                color: "#fff",
                marginTop: 3,
                backgroundColor: "transparent",
                marginRight: 5
              }}
            />
            <SemiBoldText style={styles.buttonText}>{email}</SemiBoldText>
          </RectButton>
        }
        {twitter &&
          <RectButton style={[styles.button, {marginBottom: 12}]} underlayColor="#fff" onPress={this._handlePressTwitterButton.bind(null, twitter)}>
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
            <SemiBoldText style={styles.buttonText}>@{twitter}</SemiBoldText>
          </RectButton>
        }
    </View>);
  }
}

const SEARCH_ATTENDEES = gql`
query Attendees($inputValue: String!) {
  events(slug: "reacteurope-2018") {
    attendees(q: $inputValue, uuid: "f35ad898-fe07-49cc-bd55-c4fbb59ac1b7") {
      id
      lastName
      email
      firstName
      answers {
        id
        value
        question {
          id
          title
        }
      }
    }
  }
}
`;

const ApolloAutocompleteListWithData = graphql(SEARCH_ATTENDEES)(
  ApolloAutocompleteList
);

const BORDER_RADIUS = 3;

const styles = StyleSheet.create({
  textInput: {
    alignItems: 'flex-start',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 2,
    fontSize: 24
  },
  list: {
    borderRadius: 8,
    overflow: 'hidden'
  },
  listItem: {
    alignItems: 'flex-start',
    backgroundColor: '#E0E0E0',
    padding: 12
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#eee',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    marginVertical: 30,
  },
  button: {
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
  buttonText: {
    fontSize: FontSizes.normalButton,
    color: "#fff",
    textAlign: "center",
    paddingLeft: 15,
  },
  rowText: {
    marginBottom: 15
  },
  textArea: {
    marginTop: 10,
    marginHorizontal: 20,
  }
});

export default ApolloAutocomplete;