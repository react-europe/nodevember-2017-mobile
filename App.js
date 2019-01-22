import React from 'react';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider, Query} from 'react-apollo';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {Asset, AppLoading, Font, Updates, Linking} from 'expo';
import {Platform, StatusBar, View, AsyncStorage} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {GQL} from './src/constants';
import {loadSavedTalksAsync} from './src/utils/storage';
import GET_SCHEDULE from './src/data/schedulequery';
export const Schedule = require('./src/data/schedule.json');
//const Event = Schedule.events[0];
import {saveSchedule} from './src/utils';
import { Assets as StackAssets } from 'react-navigation-stack';

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({uri: GQL.uri}),
  cache: new InMemoryCache(),
});

import AppNavigator from './src/Navigation';

export default class App extends React.Component {
  state = {
    appIsReady: false,
  };

  constructor() {
    super();
    AsyncStorage.getItem('@MySuperStore:schedule').then(schedule => {
      const event = JSON.parse(schedule);
      if (event && event.slug) {
        this.setState({schedule: event});
      }
    });
  }
  async componentWillMount() {
    const initialLinkingUri = await Linking.getInitialURL();
    console.log(initialLinkingUri);
    this.setState({initialLinkingUri: initialLinkingUri});
  }
  componentDidMount() {
    client
      .query({
        query: GET_SCHEDULE,
        variables: {slug: GQL.slug},
      })
      .then(result => {
        if (
          result &&
          result.data &&
          result.data.events &&
          result.data.events[0]
        ) {
          saveSchedule(result.data.events[0]);
        }
      });
    Updates.addListener(({type}) => {
      if (type === Updates.EventType.DOWNLOAD_FINISHED) {
        if (this.state.appIsReady) {
          this._promptForReload();
        } else {
          this._shouldPromptForReload = true;
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.appIsReady && this.state.appIsReady) {
      if (this._shouldPromptForReload) {
        this._shouldPromptForReload = false;
        setTimeout(this._promptForReload, 1000);
      }
    }
  }

  _promptForReload = () => {
    /*Alert.alert(
      'A schedule update is available',
      'You need to restart the app to get the new schedule.',
      [
        { text: 'Restart the app now', onPress: () => Updates.reload() },
        { text: "I'll do it later", onPress: () => {} },
      ]
    );*/
  };

  _loadResourcesAsync = () => {
    return Promise.all([this._loadAssetsAsync(), this._loadDataAsync()]);
  };

  _loadDataAsync = () => {
    return loadSavedTalksAsync();
  };

  _loadAssetsAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        'open-sans-bold': require('./src/assets/OpenSans-Bold.ttf'),
        'open-sans': require('./src/assets/OpenSans-Regular.ttf'),
        'open-sans-semibold': require('./src/assets/OpenSans-SemiBold.ttf'),
        ...Ionicons.font,
      }),
      Asset.fromModule(require('./src/assets/logo.png')).downloadAsync(),
      Asset.loadAsync(StackAssets),
    ]);
  };

  render() {
    if (!this.state.appIsReady) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={console.error}
          onFinish={() => {
            this.setState({appIsReady: true, schedule: Schedule.events[0]});
          }}
        />
      );
    }
    return (
      <View style={{flex: 1}}>
        <ApolloProvider client={client}>
          <AppNavigator
            screenProps={{
              event: this.state.schedule,
              initialLinkingUri: this.state.initialLinkingUri,
            }}
          />
        </ApolloProvider>
        <StatusBar barStyle="light-content" />
      </View>
    );
  }
}
