import React, { Component } from 'react';
import {
    View,
    Text,
    SectionList,
    StyleSheet, 
    TouchableOpacity,
 } from 'react-native';
import _ from 'lodash';
import FadeIn from 'react-native-fade-in-image';
import { ScrollView } from "react-native-gesture-handler";
import { Query } from 'react-apollo';
import GET_ATTENDEES from '../data/attendeesquery'
import { BoldText, SemiBoldText, RegularText } from '../components/StyledText';
import CachedImage from '../components/CachedImage';


class ContactRow extends React.Component {
    render() {
        const { item: attendee } = this.props;

        return (
            <View style={styles.row}>
                <View style={styles.rowAvatarContainer}>
                    <FadeIn>
                    <CachedImage
                        source={{ uri: attendee.avatarUrl }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                    </FadeIn>
                </View>
                <View style={styles.rowData}>
                    <BoldText>
                    {attendee.firstName} {attendee.lastName}
                    </BoldText>
                    {attendee.role ? <SemiBoldText>{attendee.role}</SemiBoldText> : null}
                    <TouchableOpacity
                    onPress={() => this._handlePressCrewTwitter(attendee.twitter)}>
                    <RegularText>@{attendee.twitter}</RegularText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

class Attendees extends Component {

    _renderItem = ({ item }) => <ContactRow item={item} onPress={this._handlePressRow} />;
    
    render() {
        return <Query query={GET_ATTENDEES}>
            {({ loading, error, data }) => {
                if (loading) return <Text>Loading...</Text>
                if (error) return <Text>Error ${error}</Text>

                const attendees = data && data.events && data.events[0] ? data.events[0].attendees : []
                console.log('attendees', attendees)

                return <SectionList
                    renderScrollComponent={(props) => <ScrollView {...props}/>}
                    stickySectionHeadersEnabled={true}
                    renderItem={this._renderItem}
                    renderSectionHeader={this._renderSectionHeader}
                    sections={[
                        {title: 'Title1', data: attendees},
                    ]}
                    keyExtractor={item => item.id}
                    initialNumToRender={10}
                />
            }}
        </Query>
        
        
    }
}

const styles = StyleSheet.create({
    row: {
      flex: 1,
      padding: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: '#eee',
      backgroundColor: '#fff',
      flexDirection: 'row',
    },
    rowAvatarContainer: {
      paddingVertical: 5,
      paddingRight: 10,
      paddingLeft: 0,
    },
    rowData: {
      flex: 1,
    },
  });
  

export default Attendees;