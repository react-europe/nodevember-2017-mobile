import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  AsyncStorage,
  TextInput,
  FlatList
} from "react-native";
import moment from "moment-timezone";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import _ from "lodash";
import { Searchbar } from "react-native-paper";
import { BoldText, RegularText, SemiBoldText } from "./StyledText";
import SearchAttendeeListItem from "./SearchAttendeeListItem";
import { Colors, FontSizes } from "../constants";

export default class SearchAttendeesInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeTextDelayed = _.debounce(this.onChangeText, 500);
    this.state = {
      text: "",
      attendees: [],
      loading: false
    };
  }

  async onChangeText(text, client) {
    const { uuid } = this.props;
    if (!this.state.loading) {
      this.setState({ loading: true });

      try {
        const { data } = await client.query({
          query: ATTENDEE_SEARCH_QUERY,
          variables: {
            slug: "reacteurope-2018",
            q: text,
            uuid
          }
        });

        const event =
          data && data.events && data.events.length > 0 && data.events[0];

        let attendees;
        if (!event) {
          attendees = [];
        } else {
          attendees = event.attendees ? event.attendees : [];
        }
        this.setState({ attendees, loading: false });
      } catch (err) {
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { attendees } = this.state;
    const { onPressAttendee } = this.props;
    return (
      <ApolloConsumer>
        {client => (
          <View style={[{ marginTop: 20, height: "100%" }, this.props.style]}>
            <View style={{ marginHorizontal: 10 }}>
              <SemiBoldText style={{ fontSize: FontSizes.title }}>
                Search Attendees
              </SemiBoldText>
              <Searchbar
                style={{ marginTop: 20, marginBottom: 20 }}
                placeholder="Search"
                onChangeText={query => this.onChangeTextDelayed(query, client)}
              />
            </View>

            <FlatList
              data={attendees}
              style={{ flexDirection: "column", flex: 1 }}
              keyExtractor={(item, index) => String(item.id)}
              renderItem={({ item, index }) => {
                return (
                  <SearchAttendeeListItem
                    contact={item}
                    tickets={this.props.tickets}
                    style={{ marginTop: 10, marginBottom: 10 }}
                    onPress={attendee => {
                      onPressAttendee(attendee);
                    }}
                  />
                );
              }}
            />
          </View>
        )}
      </ApolloConsumer>
    );
  }
}

//
const ATTENDEE_SEARCH_QUERY = gql`
  query attendeeSearch($slug: String, $q: String!, $uuid: String!) {
    events(slug: $slug) {
      attendees(q: $q, uuid: $uuid) {
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
