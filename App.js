import React from 'react';
import {ApolloProvider, Query} from 'react-apollo';
import {
  Asset,
  AppLoading,
  Constants,
  Font,
  SplashScreen,
  Updates,
  Linking,
} from 'expo';
import {
  Animated,
  Platform,
  Image,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  Dimensions,
  Easing,
} from 'react-native';
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
    isAppReady: false,
    isSplashReady: false,
    isSplashAnimationComplete: false,
  };

  splashVisibility = new Animated.Value(1);

  componentDidMount() {
    Updates.addListener(({type}) => {
      if (type === Updates.EventType.DOWNLOAD_FINISHED) {
        if (this.state.isAppReady) {
          this._promptForReload();
        } else {
          this._shouldPromptForReload = true;
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.isAppReady && this.state.isAppReady) {
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

  _loadResourcesAsync = async () => {
    SplashScreen.hide();
    try {
      await Promise.all([this._loadAssetsAsync(), this._loadDataAsync()]);
    } catch (e) {
      // if we can't load any data we should probably just not load the app
      // and give people an option to hit reload
    } finally {
      this.setState({isAppReady: true}, () => {
        Animated.timing(this.splashVisibility, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          this.setState({ isSplashAnimationComplete: true });
        });
      });
    }
  };

  _loadDataAsync = () => {
    return Promise.all([
      loadSavedTalksAsync(),
      this._loadEventAsync(),
      this._loadLinkingUrlAsync()
    ]);
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
    let schedule = await AsyncStorage.getItem('@MySuperStore2019:schedule');
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

  _cacheSplashResourcesAsync = async () => {
    const splash = require('./src/assets/splash-icon.png');
    return Asset.fromModule(splash).downloadAsync();
  };

  render() {
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          autoHideSplash={false}
          onError={console.error}
          onFinish={() => {
            this.setState({isSplashReady: true});
          }}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        {this.state.isAppReady && this.state.schedule ? (
          <ApolloProvider client={client}>
            <AppNavigator
              screenProps={{
                event: this.state.schedule,
                initialLinkingUri: this.state.initialLinkingUri,
              }}
            />
          </ApolloProvider>
        ) : null}

        {this.state.isSplashAnimationComplete ? null : (
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Constants.manifest.splash.backgroundColor,
              opacity: this.splashVisibility,
            }}>
            <Animated.Image
              style={{
                width: Dimensions.get('window').width,
                resizeMode: 'contain',
                transform: [{scale: this.splashVisibility}],
              }}
              source={require('./src/assets/splash-icon.png')}
              onLoad={this._loadResourcesAsync}
            />
          </Animated.View>
        )}
        <StatusBar barStyle="light-content" />
      </View>
    );
  }
}
