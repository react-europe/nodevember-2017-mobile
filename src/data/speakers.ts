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

export default GET_SPEAKERS;
