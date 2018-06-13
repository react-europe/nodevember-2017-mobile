import React from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Asset, AppLoading, Font, Updates } from "expo";
import { Platform, StatusBar, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GQL } from "./src/constants";
import { loadSavedTalksAsync } from "./src/utils/storage";
import { SafeAreaView } from "react-navigation";

if (Platform.OS === "android") {
  SafeAreaView.setStatusBarHeight(0);
}

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({ uri: GQL.uri }),
  cache: new InMemoryCache()
});

import Navigation from "./src/Navigation";

export default class App extends React.Component {
  state = {
    appIsReady: false
  };

  componentDidMount() {
    Updates.addListener(({ type }) => {
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
        "open-sans-bold": require("./src/assets/OpenSans-Bold.ttf"),
        "open-sans": require("./src/assets/OpenSans-Regular.ttf"),
        "open-sans-semibold": require("./src/assets/OpenSans-SemiBold.ttf"),
        ...Ionicons.font
      }),
      Asset.fromModule(require("./src/assets/logo.png")).downloadAsync(),
      Asset.fromModule(
        require("react-navigation/src/views/assets/back-icon.png")
      ).downloadAsync()
    ]);
  };

  render() {
    if (!this.state.appIsReady) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={console.error}
          onFinish={() => {
            this.setState({ appIsReady: true });
          }}
        />
      );
    }
    return (
      <View style={{flex: 1}}>
        <ApolloProvider client={client}>
          <Navigation />
        </ApolloProvider>
        <StatusBar barStyle="light-content" />
      </View>
    );
  }
}
