import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking
} from "react-native";
import FadeIn from "react-native-fade-in-image";
import { ScrollView } from "react-native-gesture-handler";
import { WebBrowser } from "expo";

import { Colors } from "../constants";
import MenuButton from "../components/MenuButton";
import { BoldText, SemiBoldText, RegularText } from "../components/StyledText";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import CachedImage from "../components/CachedImage";

export const Schedule = require("../data/schedule.json");

const CrewData = Schedule.events[0].collaborators;

class CrewRow extends React.Component {
  render() {
    const { item: crew } = this.props;

    return (
      <View style={styles.row}>
        <View style={styles.rowAvatarContainer}>
          <FadeIn>
            <CachedImage
              source={{ uri: crew.avatarUrl }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          </FadeIn>
        </View>
        <View style={styles.rowData}>
          <BoldText>
            {crew.firstName} {crew.lastName}
          </BoldText>
          {crew.role ? <SemiBoldText>{crew.role}</SemiBoldText> : null}
          <TouchableOpacity
            onPress={() => this._handlePressCrewTwitter(crew.twitter)}
          >
            <RegularText>@{crew.twitter}</RegularText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _handlePressCrewTwitter = async twitter => {
    try {
      await Linking.openURL(`twitter://user?screen_name=` + twitter);
    } catch (e) {
      WebBrowser.openBrowserAsync("https://twitter.com/" + twitter);
    }
  };
}

export default class Crews extends React.Component {
  static navigationOptions = {
    title: "Crew"
  };

  render() {
    return (
      <LoadingPlaceholder>
        <FlatList
          renderScrollComponent={props => <ScrollView {...props} />}
          renderItem={this._renderItem}
          data={CrewData}
          keyExtractor={(item, index) => index.toString()}
        />
      </LoadingPlaceholder>
    );
  }

  _renderItem = ({ item }) => {
    return <CrewRow item={item} />;
  };
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  rowAvatarContainer: {
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 0
  },
  rowData: {
    flex: 1
  }
});
