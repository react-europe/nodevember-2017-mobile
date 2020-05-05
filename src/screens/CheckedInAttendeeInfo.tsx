import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Animated, Text, StyleSheet, View, AsyncStorage} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import {Gravatar} from 'react-native-gravatar';
import Markdown from 'react-native-markdown-renderer';
import {Card, Title, useTheme, Theme} from 'react-native-paper';

import AnimatedScrollView from '../components/AnimatedScrollView';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import OverscrollView from '../components/OverscrollView';
import {SemiBoldText} from '../components/StyledText';
import {Colors, Layout} from '../constants';
import {Checkin} from '../typings/data';
import {AppRouteProp, AppNavigationProp} from '../typings/navigation';
import withHeaderHeight from '../utils/withHeaderHeight';

type CheckedInAttendeeInfoProps = {
  headerHeight: number;
  route: AppRouteProp<'CheckedInAttendeeInfo'>;
};

type DeferredCheckedInAttendeeInfoContentProps = {
  route: AppRouteProp<'CheckedInAttendeeInfo'>;
};

function CheckedInAttendeeInfo(props: CheckedInAttendeeInfoProps) {
  const theme: Theme = useTheme();
  const [scrollY] = useState(new Animated.Value(0));
  return (
    <View style={{flex: 1}}>
      <AnimatedScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 20 + Layout.notchHeight / 2}}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: true}
        )}>
        <View
          style={{
            backgroundColor: theme.colors.primary,
            padding: 10,
            paddingTop: props.headerHeight - 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        <DeferredCheckedInAttendeeInfoContent route={props.route} />
        <OverscrollView />
      </AnimatedScrollView>
    </View>
  );
}

function CheckinCard({checkins}: {checkins: Checkin[]}) {
  // console.log("props", this.props);
  // console.log("checkins", checkins);
  return <Text>Date: {checkins[0].createdAt}</Text>;
}

function DeferredCheckedInAttendeeInfoContent(
  props: DeferredCheckedInAttendeeInfoContentProps
) {
  const navigation = useNavigation<
    AppNavigationProp<'CheckedInAttendeeInfo'>
  >();
  const params = props.route.params || {};
  const checkedInAttendee = params.checkedInAttendee;

  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      <Gravatar
        options={{
          email: checkedInAttendee.email,
          parameters: {size: '200', d: 'mm'},
          secure: true,
        }}
        style={styles.roundedProfileImage}
      />

      <Card>
        <Card.Content>
          <Title>
            {checkedInAttendee.firstName + ' ' + checkedInAttendee.lastName}{' '}
          </Title>
          {checkedInAttendee?.ticket?.name && (
            <Title>Ticket Name: {checkedInAttendee.ticket.name} </Title>
          )}
          <Title>Ticket Ref: {checkedInAttendee.ref} </Title>
          <Markdown>{checkedInAttendee.checkinMessage}</Markdown>
        </Card.Content>
      </Card>
      <PrimaryButton
        onPress={() => {
          AsyncStorage.removeItem(
            '@MySuperStore2019:lastCheckedInRef'
          ).then(() => navigation.goBack());
        }}>
        <SemiBoldText accent>Close</SemiBoldText>
      </PrimaryButton>
      {checkedInAttendee.checkins && checkedInAttendee.checkins.length > 0 ? (
        <View>
          <Title>Previous Checkin</Title>
          <CheckinCard checkins={checkedInAttendee.checkins as Checkin[]} />
        </View>
      ) : null}
    </AnimatableView>
  );
}

const styles = StyleSheet.create({
  roundedProfileImage: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 50,
  },
});

export default withHeaderHeight(CheckedInAttendeeInfo);
