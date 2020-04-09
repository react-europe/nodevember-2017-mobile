import React from 'react';
import {ApolloProvider} from 'react-apollo';
import {AppLoading, SplashScreen, Updates, Linking} from 'expo';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import Constants from 'expo-constants';
import {
  Animated,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {GQL} from './src/constants';
import {loadSavedTalksAsync} from './src/utils/storage';
import GET_SCHEDULE from './src/data/schedulequery';
import {setEvent, saveSchedule} from './src/utils';
import client from './src/utils/gqlClient';
import {Assets as StackAssets} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import DataContext from './src/context/DataContext';

export default class App extends React.Component {
  state = {
    error: false,
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
          this.setState({isSplashAnimationComplete: true});
        });
      });
    }
  };

  _loadDataAsync = () => {
    return Promise.all([
      loadSavedTalksAsync(),
      this._loadEventAsync(),
      this._loadLinkingUrlAsync(),
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
      let slowestResult = await networkFetcher; // probably the network is slower?
      if (!slowestResult) {
        slowestResult = await diskFetcher; // but it's possible that it's disk too
        if (!slowestResult) {
          // ok seriously we have no data, this is not good. we can't really do
          // anything here, so let's display an error message
          this.setState({error: true});
        }
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
    try {
      let result = await client.query({
        query: GET_SCHEDULE,
        variables: {slug: GQL.slug},
      });
      if (
        result &&
        result.data &&
        result.data.events &&
        result.data.events[0]
      ) {
        let event = result.data.events[0];
        this._setEvent(event);
        return event;
      } else {
        return null;
      }
    } catch (e) {
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
    if (this.state.error) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 30, marginBottom: 15, fontWeight: 'bold'}}>
            Bad news
          </Text>
          <Text
            style={{
              color: '#888',
              marginHorizontal: 20,
              marginBottom: 20,
              fontSize: 16,
              textAlign: 'center',
            }}>
            We can't get the React Europe schedule data. We tried to grab it
            from the website and from the disk cache and neither are available.{' '}
            <Text style={{fontWeight: 'bold'}}>
              Try to open the app again when you have a network connection
            </Text>{' '}
            and if it loads we will stash that sweet sweet schedule data away to
            disk so this will never happen again.
          </Text>
          <Button
            title="I'm feeling lucky, try again"
            onPress={() => Updates.reload()}
          />
        </View>
      );
    }

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
      <SafeAreaProvider>
        <View style={{flex: 1}}>
          {this.state.isAppReady && this.state.schedule ? (
            <ApolloProvider client={client}>
              <DataContext.Provider
                value={{
                  event: this.state.schedule,
                  initialLinkingUri: this.state.initialLinkingUri,
                }}>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </DataContext.Provider>
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
      </SafeAreaProvider>
    );
  }
}
