import React from 'react';
import {ApolloProvider, Query} from 'react-apollo';
import {Asset, AppLoading, Font, Updates, Linking} from 'expo';
import {Platform, StatusBar, View, AsyncStorage} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {GQL} from './src/constants';
import {loadSavedTalksAsync} from './src/utils/storage';
import GET_SCHEDULE from './src/data/schedulequery';
import {setEvent, saveSchedule} from './src/utils';
import client from './src/utils/gqlClient';
import {Assets as StackAssets} from 'react-navigation-stack';

import AppNavigator from './src/Navigation';

export default class App extends React.Component {
  state = {
    appIsReady: false,
  };

  async componentWillMount() {}

  componentDidMount() {
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
    return Promise.all(
      loadSavedTalksAsync(),
      this._loadEventAsync(),
      this._loadLinkingUrlAsync()
    );
  };

  _loadLinkingUrlAsync = async () => {
    const initialLinkingUri = await Linking.getInitialURL();
    console.log(initialLinkingUri);
    this.setState({initialLinkingUri: initialLinkingUri});
  };

  _loadEventAsync = async () => {
    let diskFetcher = this._fetchEventFromDiskAsync();
    let networkFetcher = this._fetchEventFromNetworkAsync();
    let quickestResult = await Promise.race([diskFetcher, networkFetcher]);
    if (!quickestResult) {
      let slowestResult = await networkFetcher;
      if (!slowestResult) {
        // alert('oh no! unable to get data');
      }
    }
  };

  _fetchEventFromDiskAsync = async () => {
    let schedule = await AsyncStorage.getItem('@MySuperStore:schedule');
    const event = JSON.parse(schedule);

    if (event && event.slug) {
      this._setEvent(event);
      return event;
    } else {
      return null;
    }
  };

  _fetchEventFromNetworkAsync = async () => {
    let result = await client.query({
      query: GET_SCHEDULE,
      variables: {slug: GQL.slug},
    });
    if (result && result.data && result.data.events && result.data.events[0]) {
      let event = result.data.events[0];
      this._setEvent(event);
      return event;
    } else {
      return null;
    }
  };

  _setEvent = event => {
    setEvent(event);
    saveSchedule(event);
    this.setState({schedule: event});
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
    if (!this.state.appIsReady || !this.state.schedule) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={console.error}
          onFinish={() => {
            this.setState({appIsReady: true});
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
