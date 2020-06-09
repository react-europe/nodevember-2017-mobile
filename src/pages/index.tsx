import {gql} from 'apollo-boost';
import React from 'react';
import {Query, ApolloProvider} from 'react-apollo';
import {View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import {GQL} from '../constants';
import {SpeakerRow} from '../screens/Speakers';
import {Event} from '../typings/data';
import client from '../utils/gqlClient';

const SPEAKERS = gql`
  query speakers($slug: String!) {
    events(slug: $slug) {
      id
      name
      speakers {
        id
        name
        twitter
        github
        avatarUrl
        bio
        talks {
          id
          title
          type
          description
          length
          startDate
        }
      }
    }
  }
`;

export default function App() {
  return (
    <View>
      <ApolloProvider client={client}>
        <Query<{events: Event[]}> query={SPEAKERS} variables={{slug: GQL.slug}}>
          {({loading, error, data}) => {
            if (loading) {
              return (
                <View style={{padding: 20}}>
                  <ActivityIndicator size="large" />
                </View>
              );
            }
            if (error) {
              return (
                <View style={{padding: 20}}>
                  <Text style={{color: 'red', fontSize: 20}}>Error :(</Text>
                </View>
              );
            }
            return (
              <View
                style={{
                  padding: 10,
                }}>
                {data &&
                  data.events[0].speakers?.map((speaker) => {
                    if (speaker) {
                      return <SpeakerRow item={speaker} />;
                    }
                  })}
              </View>
            );
          }}
        </Query>
      </ApolloProvider>
    </View>
  );
}
