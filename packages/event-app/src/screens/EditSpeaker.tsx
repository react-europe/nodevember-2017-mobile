import {gql} from 'apollo-boost';
import React, {useEffect, useContext} from 'react';
import {View, Text} from 'react-native';
import {useRecoilState} from 'recoil';

import DataContext from '../context/DataContext';
import {adminTokenState} from '../context/adminTokenState';
import client from '../utils/gqlClient';

const GET_SPEAKERS_INFO = gql`
  query AdminSpeakerInfo($id: Int!, $token: String!, $speakerId: Int!) {
    adminEvents(id: $id, token: $token) {
      adminSpeakers(speakerId: $speakerId) {
        id
        name
        twitter
        github
        email
        shortBio
        bio
        status
      }
    }
  }
`;

export default function EditSpeaker() {
  const [adminToken, setAdminToken] = useRecoilState(adminTokenState);
  const {event} = useContext(DataContext);

  async function fetchSpeakerInfo() {
    try {
      const result = await client.mutate({
        mutation: GET_SPEAKERS_INFO,
        variables: {
          id: /* event?.id */ 171,
          token: adminToken?.token,
          speakerId: 1062,
        },
      });
      console.log('RESULT: ', result);
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  useEffect(() => {
    if (!adminToken?.token || !event?.id) return;
    fetchSpeakerInfo();
  }, [adminToken, event]);

  return (
    <View>
      <Text>Edit Speaker</Text>
    </View>
  );
}
