import React from 'react';
import {Portal, Dialog, Paragraph, Button} from 'react-native-paper';

type ShareInfoProps = {
  isSharingInfo: boolean;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ShareInfo(props: ShareInfoProps) {
  const {isSharingInfo, visible, setVisible} = props;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>
          {isSharingInfo ? 'Disable share info' : 'Enable share info'}
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            - You will {isSharingInfo && 'not '}be searchable by other attendees
          </Paragraph>
          <Paragraph>
            - You will {isSharingInfo && 'not '}be able to search for other
            attendees
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>Close</Button>
          {isSharingInfo ? (
            <Button onPress={() => setVisible(false)}>Disable</Button>
          ) : (
            <Button onPress={() => setVisible(false)}>Enable</Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
