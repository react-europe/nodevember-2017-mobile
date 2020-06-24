import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {BoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {MiniEvent} from '../typings/data';

type EditionRowProps = {
  edition: MiniEvent;
};

function EditionRow(props: EditionRowProps) {
  const {edition} = props;

  const handlePress = async () => {
    console.log('Pressed');
  };

  return (
    <View style={styles.row}>
      <BoldText fontSize="sm">{edition.name}</BoldText>
    </View>
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
  console.log(editions);

  return (
    <LoadingPlaceholder>
      <FlatList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        renderItem={_renderItem}
        data={editions}
        keyExtractor={(item, index) => index.toString()}
      />
    </LoadingPlaceholder>
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
