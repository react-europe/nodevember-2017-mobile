import gql from 'graphql-tag';

const GET_ATTENDEES = gql`
    {
        events(slug: "reacteurope-2018") {
            attendees(q:"a", uuid:"f35ad898-fe07-49cc-bd55-c4fbb59ac1b7") {
                id
                lastName
                email
                firstName
                answers {
                    id
                    value
                    question {
                        id
                        title
                    }
                }

            }
        }
    }
`;

export default GET_ATTENDEES;