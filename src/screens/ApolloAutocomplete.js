import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SectionList,
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

import {
  graphql
} from 'react-apollo';
import gql from 'graphql-tag';
import Downshift from 'downshift'

class ApolloAutocomplete extends React.Component {
  render() {
    return (
      <Downshift>
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
            <ApolloAutocompleteListWithData
              {...{
                getInputProps,
                getItemProps,
                getLabelProps,
                inputValue,
                selectedItem,
                highlightedIndex,
                isOpen,
              }}
            />
          </View>}
      </Downshift>
    )
  }
}

class ApolloAutocompleteList extends React.Component {
  _renderItem = ({ item }) => {
    return (<View>
      <Text>{item.firstName}</Text>
    </View>);
  };

  _renderSectionHeader = ({ section }) => {
    const {getInputProps} = this.props;

    return (
      <View style={styles.sectionHeader}>
        <TextInput {...getInputProps()} style={styles.textInput} />
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

const styles = StyleSheet.create({
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
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default ApolloAutocomplete;