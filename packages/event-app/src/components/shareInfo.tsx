import {gql} from 'apollo-boost';
import React from 'react';
import {Portal, Dialog, Paragraph, Button} from 'react-native-paper';
import {useRecoilState} from 'recoil';

import {ticketState} from '../context/ticketState';
import {User} from '../typings/data';
import {getUuid, updateTickets} from '../utils';
import client from '../utils/gqlClient';

const UPDATE_SHARING_INFO = gql`
  mutation updateAttendee($uuid: String!, $shareInfo: Boolean!) {
    updateAttendee(uuid: $uuid, shareInfo: $shareInfo) {
      id
      shareInfo
    }
  }
`;

type ShareInfoProps = {
  isSharingInfo: boolean;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ShareInfo(props: ShareInfoProps) {
  const {isSharingInfo, visible, setVisible} = props;
  const [tickets, setTickets] = useRecoilState(ticketState);

  async function updateShareInfo() {
    if (!tickets) return;
    const uuid = getUuid(tickets);
    const variables = {uuid, shareInfo: !isSharingInfo};

    try {
      await client.mutate({
        mutation: UPDATE_SHARING_INFO,
        variables,
      });
      const userTickets: User[] = JSON.parse(JSON.stringify(tickets));
      const index = userTickets.findIndex((ticket) => ticket.uuid === uuid);
      if (index === -1) return;
      userTickets[index].shareInfo = !isSharingInfo;
      setTickets(userTickets);
      await updateTickets(JSON.stringify(userTickets));
    } catch (e) {
      console.log(e);
    }
    setVisible(false);
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>
          {isSharingInfo ? 'Disable share info' : 'Enable share info'}
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            - You will {isSharingInfo && 'not '}be searchable by other attendees
            by name and email
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>Close</Button>
          <Button onPress={updateShareInfo}>
            {isSharingInfo ? 'Disable' : 'Enable'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
