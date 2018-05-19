import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import {Colors} from "../constants";
import MenuButton from '../components/MenuButton';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  ApolloProvider,
} from 'react-apollo';
import ApolloAutocomplete from './ApolloAutocomplete';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://www.react-europe.org/gql' }),
  cache: new InMemoryCache(),
});

class SearchAttendees extends React.Component {
  static navigationOptions = {
    title: 'Search Attendees',
    headerStyle: { backgroundColor: Colors.blue },
    headerTintColor: 'white',
    headerLeft: <MenuButton />,
    headerTitleStyle: {
      fontFamily: 'open-sans-bold',
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <ApolloProvider client={client} >
          <View>
            <ApolloAutocomplete />
          </View>
        </ApolloProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  }
});

export default SearchAttendees;
