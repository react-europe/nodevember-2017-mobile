import React from 'react';
import {Platform, StyleSheet, View, StyleProp, ViewStyle} from 'react-native';

import {Colors, FontSizes} from '../constants';
import {Schedule} from '../typings/data';
import {conferenceHasEnded} from '../utils';
import CachedImage from './CachedImage';
import ImageFadeIn from './ImageFadeIn';
import LinkButton from './LinkButton';
import {BoldText, RegularText, SemiBoldText} from './StyledText';

type Props = {
  talk: Schedule;
  style?: StyleProp<ViewStyle>;
};

function TalkCard(props: Props) {
  const speakers = props.talk.speakers;

  const _renderPlaceholderForNextYear = () => {
    return (
      <View style={[styles.button, props.style]}>
        <RegularText style={styles.nextYear}>See you in 2019!</RegularText>
      </View>
    );
  };

  if (conferenceHasEnded() && (!speakers || speakers.length === 0)) {
    return _renderPlaceholderForNextYear();
  }

  return (
    <LinkButton
      to={'/details?scheduleId=' + props.talk.id}
      style={[styles.button, props.style]}>
      {speakers &&
        speakers.map((speaker) => {
          if (!speaker) {
            return;
          }
          return (
            <View style={styles.headerRow} key={speaker.id as number}>
              {speaker.avatarUrl && (
                <View style={styles.headerRowAvatarContainer}>
                  <ImageFadeIn>
                    <CachedImage
                      source={{uri: speaker.avatarUrl}}
                      style={{width: 40, height: 40, borderRadius: 20}}
                    />
                  </ImageFadeIn>
                </View>
              )}
              <View style={styles.headerRowInfoContainer}>
                <BoldText style={styles.speakerName} numberOfLines={1}>
                  {speaker.name}
                </BoldText>
                {speaker.twitter ? (
                  <SemiBoldText
                    style={styles.organizationName}
                    numberOfLines={1}>
                    @{speaker.twitter}
                  </SemiBoldText>
                ) : null}
              </View>
            </View>
          );
        })}
      <View style={styles.talkInfoRow}>
        {/* <RegularText style={styles.talkTitle}>  // TODO (Handle save talk)
          <SaveIconWhenSaved talk={props.talk} />
          {props.talk.title}
        </RegularText> */}
        {conferenceHasEnded() || !props.talk.room ? null : (
          <RegularText style={styles.talkLocation}>
            {props.talk.room}
          </RegularText>
        )}
      </View>
    </LinkButton>
  );
}

export default TalkCard;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
  },
  headerRowAvatarContainer: {
    paddingRight: 10,
  },
  headerRowInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  speakerName: {
    fontSize: FontSizes.md,
  },
  organizationName: {
    color: Colors.faint,
    fontSize: FontSizes.sm,
  },
  talkInfoRow: {
    paddingTop: 10,
  },
  talkTitle: {
    fontSize: FontSizes.sm,
  },
  talkLocation: {
    fontSize: FontSizes.sm,
    color: Colors.faint,
    marginTop: 10,
  },
  nextYear: {
    textAlign: 'center',
    fontSize: FontSizes.lg,
    marginVertical: 10,
  },
  button: {
    padding: 15,
    ...Platform.select({
      ios: {
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: {width: 2, height: 2},
      },
      android: {
        backgroundColor: '#fff',
        elevation: 2,
      },
    }),
  },
});
