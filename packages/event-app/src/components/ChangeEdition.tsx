import React, {useContext} from 'react';
import {AsyncStorage} from 'react-native';
import {Portal, Dialog, Paragraph, Button} from 'react-native-paper';

import DataContext from '../context/DataContext';
import GET_SCHEDULE from '../data/schedulequery';
import {Event} from '../typings/data';
import {setEvent, saveSchedule} from '../utils';
import client from '../utils/gqlClient';

type ChangeEditionProps = {
  editionSlug: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ChangeEdition(props: ChangeEditionProps) {
  const {setSchedule} = useContext(DataContext);
  const {editionSlug, visible, setVisible} = props;

  const fetchDataEdition = async (editionSlug: string) => {
    try {
      const result = await client.query({
        query: GET_SCHEDULE,
        variables: {slug: editionSlug},
      });
      if (result?.data?.events[0]) {
        const event: Event = result.data.events[0];
        setSchedule(event);
        setEvent(event);
        saveSchedule(event);
        return event;
      }
    } catch (e) {
      console.log(e);
    }
  };

  async function handleChangeEdition() {
    try {
      await AsyncStorage.setItem(
        '@MySuperStore2019:edition',
        JSON.stringify(editionSlug)
      );
      await fetchDataEdition(editionSlug);
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
