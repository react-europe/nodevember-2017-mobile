import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Button,
  Platform,
  Constants,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from "react-native";
import Navigationbar from "../components/NavigationBar";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Layout } from "../constants";
import CachedImage from "../components/CachedImage";

class MenuScreen extends Component {
  static navigationOptions = {
    title: "Menu"
  };

  getIconName = key => {
    if (key === "Speakers") return "ios-microphone";
    if (key === "Crew") return "ios-information-circle";
    if (key === "Sponsors") return "ios-beer";
    if (key === "Attendees") return "ios-people";
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <FlatList
          data={[
            { key: "Speakers" },
            { key: "Crew" },
            { key: "Sponsors" },
            { key: "Attendees" }
          ]}
          ListHeaderComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: 240 + Layout.notchHeight
              }}
            >
              <CachedImage
                source={require("../assets/hero.png")}
                style={{
                  height: 240 + Layout.notchHeight,
                  width: Layout.window.width,
                  resizeMode: "cover",
                  position: "absolute"
                }}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: "rgba(0,0,0,0.5)"
                  }
                ]}
              />
              <Image
                source={require("../assets/logo.png")}
                style={[
                  {
                    width: 220,
                    height: 100,
                    resizeMode: "contain"
                  }
                ]}
                tintColor="#fff"
              />
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: "#cdcdcd"
              }}
            />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(item.key)}
            >
              <View
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Ionicons
                  name={`${this.getIconName(item.key)}`}
                  size={24}
                  color={Colors.blue}
                />
                <Text style={{ fontSize: 20, marginHorizontal: 16, flex: 1 }}>
                  {item.key}
                </Text>
                <Ionicons
                  name="ios-arrow-forward-outline"
                  size={24}
                  color="#999"
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

export default MenuScreen;
