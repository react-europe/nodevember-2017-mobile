import React from "react";
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {Colors} from "../constants";
import MenuButton from '../components/MenuButton';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  ApolloProvider,
  graphql
} from 'react-apollo';
import gql from 'graphql-tag';
import Downshift from 'downshift'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cj5k7w90bjt2i0122z6v0syvu' }),
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
      <SafeAreaView style={styles.container}>
        <Text>Test</Text>
        <ApolloProvider client={client}>
          <View>
            <ApolloAutocomplete />
          </View>
        </ApolloProvider>
      </SafeAreaView>
    );
  }
}

function ApolloAutocomplete() {
  return (
    <Downshift onChange={item => console.log(item)}>
      {({
          getInputProps,
          getItemProps,
          getLabelProps,
          inputValue,
          selectedItem,
          highlightedIndex,
          isOpen,
          getRootProps,
        }) =>
        <View {...getRootProps({refKey: 'ref'}, {suppressRefError: true})}>
          <TextInput {...getInputProps()} style={styles.textInput} />
          {isOpen
            ? <View style={styles.list}>
              <ApolloAutocompleteMenuWithData
                {...{
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                  getItemProps,
                }}
              />
            </View>
            : null}
        </View>}
    </Downshift>
  )
}

function ApolloAutocompleteMenu({
                                  data: {allColors, loading},
                                  selectedItem,
                                  highlightedIndex,
                                  getItemProps,
                                }) {
  if (loading) {
    return (<View>
      <Text>Loading...</Text>
    </View>)
  }
  return (
    <View>
      {allColors.map(({name: item}, index) =>
        <TouchableOpacity style={styles.listItem} {...getItemProps({ item, index, key: item, }) }>
          <View>
            <Text style={{ fontWeight: item ? 'bold' : 'normal' }}>
              {item}
            </Text>
          </View>
        </TouchableOpacity>,
      )}
    </View>
  )
}

const SEARCH_COLORS = gql`
  query AllColors($inputValue: String!) {
    allColors(filter: {name_contains: $inputValue}) {
      name
    }
  }
`;

const ApolloAutocompleteMenuWithData = graphql(SEARCH_COLORS)(
  ApolloAutocompleteMenu,
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 12
  },
  textInput: {
    alignItems: 'flex-start',
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 2
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
});

export default SearchAttendees;
