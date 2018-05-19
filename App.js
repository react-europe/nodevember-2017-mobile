import React from "react";
import { Asset, AppLoading, Font, Updates } from "expo";
import { AsyncStorage, Alert, Platform, View } from "react-native";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Ionicons } from "@expo/vector-icons";
import { loadSavedTalksAsync } from "./src/utils/storage";
import { SafeAreaView } from "react-navigation";

if (Platform.OS === "android") {
  SafeAreaView.setStatusBarHeight(0);
}

const client = new ApolloClient({
  uri: "https://www.react-europe.org/gql"
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
      <ApolloProvider client={client}>
        <Navigation />
      </ApolloProvider>
    );
  }
}
