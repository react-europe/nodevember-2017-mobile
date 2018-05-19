import React from "react";
import { Platform } from "react-native";
import { connectDrawerButton } from "../Navigation";
import { BorderlessButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Layout } from "../constants";

export default class MenuButton extends React.Component {
  render() {
    return (
      <BorderlessButton
        onPress={this.props.openDrawer}
        style={{
          marginBottom: 2,
          marginRight: 5,
          marginTop: Layout.notchHeight > 0 ? 0 : 3,
          marginLeft: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
          alignSelf: "flex-start"
        }}
        hitSlop={{ left: 30, top: 30, right: 30, bottom: 30 }}
      >
        <Ionicons
          name={Platform.OS === "ios" ? "ios-menu-outline" : "md-menu"}
          size={28}
          color="#fff"
        />
      </BorderlessButton>
    );
  }
}
