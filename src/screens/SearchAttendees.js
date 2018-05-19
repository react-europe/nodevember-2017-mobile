import React from "react";
import {
  View
} from "react-native";
import {Colors} from "../constants";
import MenuButton from '../components/MenuButton';

class SearchAttendees extends React.Component {
  static navigationOptions = {
    title: 'Search Attendees',
    headerStyle: { backgroundColor: Colors.blue },
    headerTintColor: 'white',
    headerLeft: <MenuButton />,
    headerTitleStyle: {
      fontFamily: 'open-sans-bold',
    },
  };

  render() {
    return (
      <View></View>
    );
  }
}

export default SearchAttendees;
