import {gql} from 'apollo-boost';

const GET_SPEAKERS = gql`
  query speakers($slug: String!) {
    events(slug: $slug) {
      id
      name
      speakers {
        id
        name
        twitter
        github
        avatarUrl
        bio
        talks {
          id
          title
          type
          description
          length
          startDate
        }
      }
    }
  }
`;

const ADMIN_GET_SPEAKERS = gql`
  query fetchAllSpeakers($token: String!, $id: Int!, $status: Int!) {
    adminEvents(id: $id, token: $token) {
      id
      adminSpeakers(status: $status) {
        id
        name
        twitter
        github
        bio
        avatarUrl
        displayOrder
        talks {
          title
          id
        }
      }
    }
  }
`;

const UPDATE_SPEAKER_POSITION = gql`
  mutation updateSpeaker($id: Int!, $token: String!, $displayOrder: Int!) {
    updateSpeaker(id: $id, token: $token, displayOrder: $displayOrder) {
      name
      displayOrder
    }
  }
`;

const GET_SPEAKERS_INFO = gql`
  query AdminSpeakerInfo($id: Int!, $token: String!, $speakerId: Int!) {
    adminEvents(id: $id, token: $token) {
      id
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

const UPDATE_SPEAKER = gql`
  mutation updateSpeaker(
    $id: Int!
    $token: String!
    $email: String!
    $github: String!
    $name: String!
    $twitter: String!
    $bio: String!
    $shortBio: String!
    $status: Int!
  ) {
    updateSpeaker(
      id: $id
      token: $token
      email: $email
      github: $github
      name: $name
      twitter: $twitter
      bio: $bio
      shortBio: $shortBio
      status: $status
    ) {
      name
      twitter
      github
      email
      shortBio
      bio
      status
    }
  }
`;

export {
  ADMIN_GET_SPEAKERS,
  UPDATE_SPEAKER_POSITION,
  GET_SPEAKERS_INFO,
  UPDATE_SPEAKER,
};

export default GET_SPEAKERS;
