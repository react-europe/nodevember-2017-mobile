import React from 'react';
import {AsyncStorage} from 'react-native';
import {Portal, Dialog, Paragraph, Button} from 'react-native-paper';

type ChangeEditionProps = {
  editionSlug: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ChangeEdition(props: ChangeEditionProps) {
  const {editionSlug, visible, setVisible} = props;

  async function handleChangeEdition() {
    try {
      await AsyncStorage.setItem(
        '@MySuperStore2019:edition',
        JSON.stringify(editionSlug)
      );
    } catch (err) {
      console.log(err);
    }
    setVisible(false);
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Change edition</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            {editionSlug} data will be used at your next app restart
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>Close</Button>
          <Button onPress={handleChangeEdition}>Change edition</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
