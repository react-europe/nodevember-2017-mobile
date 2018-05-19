import React, { Component } from 'react';
import { Text } from 'react-native';
import { Query } from 'react-apollo';
import GET_ATTENDEES from '../data/attendeesquery'

class Attendees extends Component {
    render() {
        return <Query query={GET_ATTENDEES}>
            {({ loading, error, data }) => {
                if (loading) return <Text>Loading...</Text>
                if (error) return <Text>Error ${error}</Text>

                const attendees = data && data.events && data.events[0] ? data.events[0].attendees : []
                console.log('attendees', attendees)

                return <Text>ATTENDEES</Text>
            }}
        </Query>
        
        
    }
}

export default Attendees;