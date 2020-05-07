import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Animated, View} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';
import Markdown from 'react-native-markdown-renderer';
import {Card, Title, Theme, useTheme} from 'react-native-paper';

import AnimatedScrollView from '../components/AnimatedScrollView';
import OverscrollView from '../components/OverscrollView';
import PrimaryButton from '../components/PrimaryButton';
import {SemiBoldText} from '../components/StyledText';
import {Layout} from '../constants';
import {User} from '../typings/data';
import {AppRouteProp, AppNavigationProp} from '../typings/navigation';
import useHeaderHeight from '../utils/useHeaderHeight';

type TicketInstructionsProps = {
  route: AppRouteProp<'TicketInstructions'>;
};

type DeferredTicketInstructionsContentProps = {
  ticketParams: {ticket: User};
};

export default function TicketInstructions(props: TicketInstructionsProps) {
  const headerHeight = useHeaderHeight();
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
            paddingTop: headerHeight - 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <DeferredTicketInstructionsContent ticketParams={props.route.params} />
        <OverscrollView />
      </AnimatedScrollView>
    </View>
  );
}

function DeferredTicketInstructionsContent({
  ticketParams,
}: DeferredTicketInstructionsContentProps) {
  const navigation = useNavigation<AppNavigationProp<'TicketInstructions'>>();
  const ticket = ticketParams.ticket;
  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      <Card>
        <Card.Content>
          <Title>{ticket.firstName + ' ' + ticket.lastName} </Title>
          <Title>Ticket Ref: {ticket.ref} </Title>
          <Markdown>{ticket.mobileMessage}</Markdown>
        </Card.Content>
      </Card>
      <PrimaryButton onPress={() => navigation.goBack()}>
        <SemiBoldText fontSize="md" accent>
          Close
        </SemiBoldText>
      </PrimaryButton>
    </AnimatableView>
  );
}
