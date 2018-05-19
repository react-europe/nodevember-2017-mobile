import React from "react";
import {
  TouchableOpacity,
  AsyncStorage,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView, RectButton } from "react-native-gesture-handler";

import { FontSizes, Colors } from "../constants";
import MenuButton from "../components/MenuButton";
import { RegularText } from "../components/StyledText";
import LoadingPlaceholder from "../components/LoadingPlaceholder";

export const Schedule = require("../data/schedule.json");

const BORDER_RADIUS = 3;
export class StaffCheckinListRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item: item } = this.props;
    return (
      <TouchableOpacity onPress={this._handleCheckinListPress}>
        <RectButton
          activeOpacity={0.05}
          style={{ flex: 1, backgroundColor: "#fff" }}
        >
          <View style={styles.row}>
            {item.name ? (
              <View>
                <RegularText>{item.name}</RegularText>
              </View>
            ) : null}
          </View>
        </RectButton>
      </TouchableOpacity>
    );
  }
  _handleCheckinListPress = () => {
    console.log("checkinlist pressed", this.props.item);
    console.log("checkinlist pressed uuid", this.props.item, this.props.uuid);
    this.props.navigation.navigate("QRCheckinScanner", {
      checkinList: this.props.item,
      uuid: this.props.uuid
    });
  };
}

export default class StaffCheckinLists extends React.Component {
  static navigationOptions = {
    title: "Staff Checkin Lists",
    headerStyle: { backgroundColor: Colors.blue },
    headerTintColor: "white",
    headerLeft: <MenuButton />,
    headerTitleStyle: {
      fontFamily: "open-sans-bold"
    }
  };
  state = {
    staffCheckinLists: [],
    uuid: ""
  };

  async getTickets() {
    try {
      const value = await AsyncStorage.getItem("@MySuperStore:tickets");
      console.log("tickets", value);
      const json = JSON.parse(value) || [];
      let staffCheckinListsArray = [];
      let uuid = "";
      json.map(ticket => {
        if (
          ticket &&
          ticket.staffCheckinLists &&
          ticket.staffCheckinLists.length > 0
        ) {
          staffCheckinListsArray = ticket.staffCheckinLists;
          uuid = ticket.uuid;
        }
      });
      this.setState({ staffCheckinLists: staffCheckinListsArray, uuid: uuid });
      this.staffCheckinLists = staffCheckinListsArray;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.getTickets();
  }

  render() {
    const checkinLists = this.state.staffCheckinLists || [];
    console.log("tickets", checkinLists);
    return (
      <LoadingPlaceholder>
        <FlatList
          renderScrollComponent={props => <ScrollView {...props} />}
          renderSectionHeader={this._renderSectionHeader}
          stickySectionHeadersEnabled={true}
          data={checkinLists}
          renderItem={this._renderItem}
          //<ListItem title={item.lastName} description="Press here to start checking people" icon="folder" key={item.id}/>}

          /**/
          keyExtractor={(item) => item.id && item.id.toString()}
        />
      </LoadingPlaceholder>
    );
  }

  _renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText>{section.title}</RegularText>
      </View>
    );
  };
  _renderItem = ({ item }) => {
    return (
      <StaffCheckinListRow
        item={item}
        id={item.id}
        uuid={this.state.uuid}
        navigation={this.props.navigation}
      />
    );
  };
}

const styles = StyleSheet.create({
  bigButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    flexDirection: "row"
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: "#fff",
    textAlign: "center"
  },
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee"
  },
  rowAvatarContainer: {
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 0
  },
  rowData: {
    flex: 1
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#eee"
  }
});
