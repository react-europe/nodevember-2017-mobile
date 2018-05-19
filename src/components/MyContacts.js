import React from "react";
import { View, AsyncStorage } from "react-native";

import { SemiBoldText } from "./StyledText";
import ContactCard from "./ContactCard";
import { FontSizes } from "../constants";

export default class MyContacts extends React.Component {
  state = {
    contacts: []
  };
  async getContacts() {
    try {
      const value = await AsyncStorage.getItem("@MySuperStore:contacts");
      this.setState({ contacts: JSON.parse(value) });
    } catch (err) {
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.contacts = [];
    this.tickets = this.props.tickets;
    // console.log("tickets from MyContacts", this.tickets);
  }
  componentDidMount() {
    this.getContacts();
  }
  render() {
    const contacts = this.state.contacts || [];
    return (
      <View style={[{ marginHorizontal: 10 }, this.props.style]}>
        <SemiBoldText style={{ fontSize: FontSizes.title }}>
          My Contacts
        </SemiBoldText>
        {contacts.map(contact => (
          <ContactCard
            key={contact.id + contact.email}
            contact={contact}
            tickets={this.props.tickets}
            style={{ marginTop: 10, marginBottom: 10 }}
          />
        ))}
      </View>
    );
  }
}
