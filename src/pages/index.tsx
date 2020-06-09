import React from 'react';
import {Query} from 'react-apollo';
import {View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import Providers from '../components/Providers';
import {GQL} from '../constants';
import GET_SPEAKERS from '../data/speakers';
import {SpeakerRow} from '../screens/Speakers';
import {Event} from '../typings/data';

export default function App() {
  return (
    <View>
      <Providers>
        <Query<{events: Event[]}>
          query={GET_SPEAKERS}
          variables={{slug: GQL.slug}}>
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
      </Providers>
    </View>
  );
}
