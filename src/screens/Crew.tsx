import * as WebBrowser from 'expo-web-browser';
import React, {useContext} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import CachedImage from '../components/CachedImage';
import ImageFadeIn from '../components/ImageFadeIn';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {BoldText, SemiBoldText, RegularText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {Collaborator} from '../typings/data';

type CrewRowProps = {
  item: Collaborator;
};

function CrewRow(props: CrewRowProps) {
  const {item: crew} = props;

  const _handlePressCrewTwitter = async (twitter: string) => {
    if (Platform.OS === 'web') {
      WebBrowser.openBrowserAsync('https://twitter.com/' + twitter);
    } else {
      try {
        await Linking.openURL(`twitter://user?screen_name=` + twitter);
      } catch (e) {
        WebBrowser.openBrowserAsync('https://twitter.com/' + twitter);
      }
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.rowAvatarContainer}>
        <ImageFadeIn>
          {crew.avatarUrl && (
            <CachedImage
              source={{uri: crew.avatarUrl}}
              style={{width: 50, height: 50, borderRadius: 25}}
            />
          )}
        </ImageFadeIn>
      </View>
      <View style={styles.rowData}>
        <BoldText fontSize="sm">
          {crew.firstName} {crew.lastName}
        </BoldText>
        {crew.role ? (
          <SemiBoldText fontSize="sm">{crew.role}</SemiBoldText>
        ) : null}
        {crew.twitter && crew.twitter !== '' ? (
          <TouchableOpacity
            onPress={() => _handlePressCrewTwitter(crew.twitter as string)}>
            <RegularText fontSize="sm">@{crew.twitter}</RegularText>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default function Crews() {
  const {event} = useContext(DataContext);
  let collaborators: Collaborator[] = [];
  if (event?.collaborators && event.collaborators.length > 0) {
    collaborators = event.collaborators as Collaborator[];
  }
  const _renderItem = ({item}: {item: Collaborator}) => {
    return <CrewRow item={item} />;
  };

  return (
    <LoadingPlaceholder>
      <FlatList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        renderItem={_renderItem}
        data={collaborators}
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
  rowAvatarContainer: {
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 0,
  },
  rowData: {
    flex: 1,
  },
});
