import {gql} from 'apollo-boost';

const GET_TICKET_INFO = gql`
  query Tickets($id: Int!, $token: String!, $ticketId: Int!) {
    adminEvents(id: $id, token: $token) {
      tickets(ticketId: $ticketId) {
        name
        description
        quantity
        price
        maxPerOrder
        startDate
        endDate
        thankYouText
        mobileMessage
        includeVat
        showVat
        showDaysLeft
        showTicketsLeft
        showTicketsBeforeStart
        showTicketsPriceBeforeStart
      }
    }
  }
`;

const UPDATE_TICKET = gql`
  mutation UpdateTickets(
    $id: Int!
    $token: String!
    $name: String!
    $description: String!
    $quantity: Int!
    $price: Int!
    $maxPerOrder: Int!
    $startDate: DateType!
    $endDate: DateType!
    $thankYouText: String!
    $includeVat: Boolean!
    $showVat: Boolean!
    $showDaysLeft: Boolean!
    $showTicketsLeft: Boolean!
    $showTicketsBeforeStart: Boolean!
    $showTicketsPriceBeforeStart: Boolean!
  ) {
    updateTicket(
      id: $id
      token: $token
      name: $name
      description: $description
      quantity: $quantity
      price: $price
      maxPerOrder: $maxPerOrder
      startDate: $startDate
      endDate: $endDate
      thankYouText: $thankYouText
      includeVat: $includeVat
      showVat: $showVat
      showDaysLeft: $showDaysLeft
      showTicketsLeft: $showTicketsLeft
      showTicketsBeforeStart: $showTicketsBeforeStart
      showTicketsPriceBeforeStart: $showTicketsPriceBeforeStart
    ) {
      name
    }
  }
`;

const CREATE_TICKET = gql`
  mutation CreateTicket(
    $id: Int!
    $token: String!
    $name: String!
    $description: String
    $quantity: Int
    $price: Int
    $maxPerOrder: Int
    $startDate: DateType
    $endDate: DateType
    $thankYouText: String
    $includeVat: Boolean
    $showVat: Boolean
    $showDaysLeft: Boolean
    $showTicketsLeft: Boolean
    $showTicketsBeforeStart: Boolean
    $showTicketsPriceBeforeStart: Boolean
  ) {
    createTicket(
      eventId: $id
      token: $token
      name: $name
      description: $description
      quantity: $quantity
      price: $price
      maxPerOrder: $maxPerOrder
      startDate: $startDate
      endDate: $endDate
      thankYouText: $thankYouText
      includeVat: $includeVat
      showVat: $showVat
      showDaysLeft: $showDaysLeft
      showTicketsLeft: $showTicketsLeft
      showTicketsBeforeStart: $showTicketsBeforeStart
      showTicketsPriceBeforeStart: $showTicketsPriceBeforeStart
    ) {
      name
    }
  }
`;

export {GET_TICKET_INFO, UPDATE_TICKET, CREATE_TICKET};
