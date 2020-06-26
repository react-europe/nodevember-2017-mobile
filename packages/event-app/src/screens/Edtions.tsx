import React, {useContext, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

import ChangeEdition from '../components/ChangeEdition';
import {BoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {MiniEvent} from '../typings/data';

type EditionRowProps = {
  edition: MiniEvent;
};

function EditionRow(props: EditionRowProps) {
  const {edition} = props;
  const [visible, setVisible] = useState(false);

  async function handlePress() {
    setVisible(true);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.row}>
        <BoldText fontSize="sm">{edition.name}</BoldText>
      </View>
      <ChangeEdition
        editionSlug={edition.slug as string}
        visible={visible}
        setVisible={setVisible}
      />
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
