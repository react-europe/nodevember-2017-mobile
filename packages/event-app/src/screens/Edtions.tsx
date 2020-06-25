import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View, AsyncStorage} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Portal, Dialog, Paragraph, Button} from 'react-native-paper';

import {BoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {MiniEvent} from '../typings/data';

type EditionRowProps = {
  edition: MiniEvent;
};

function EditionRow(props: EditionRowProps) {
  const {edition} = props;
  const [visible, setVisible] = useState(false);

  async function handleChangeEdition() {
    if (!edition.slug) return;
    try {
      await AsyncStorage.setItem(
        '@MySuperStore2019:edition',
        JSON.stringify(edition.slug)
      );
    } catch (err) {
      console.log(err);
    }
    setVisible(false);
  }

  async function handlePress() {
    setVisible(true);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.row}>
        <BoldText fontSize="sm">{edition.name}</BoldText>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Change edition</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              {edition.name} data will be used at your next app restart
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Close</Button>
            <Button onPress={handleChangeEdition}>Change edition</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </TouchableOpacity>
  );
}

export default function Editions() {
  const {event} = useContext(DataContext);

  let editions: MiniEvent[] = [];
  if (event?.otherEditions && event.otherEditions.length > 0) {
    editions = event.otherEditions as MiniEvent[];
  }

  const _renderItem = ({item}: {item: MiniEvent}) => {
    return <EditionRow edition={item} />;
  };

  return (
    <FlatList
      renderScrollComponent={(props) => <ScrollView {...props} />}
      renderItem={_renderItem}
      data={editions}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
});
