import React, {useState} from 'react';
import {Animated, View} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';

import withNavigation from '../utils/withNavigation';
import AnimatedScrollView from '../components/AnimatedScrollView';
import {Colors, Layout} from '../constants';
import {Button, Card, CardContent, Title} from 'react-native-paper';
import Markdown from 'react-native-markdown-renderer';
import withHeaderHeight from '../utils/withHeaderHeight';

function TicketInstructions(props) {
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
            backgroundColor: Colors.blue,
            padding: 10,
            paddingTop: props.headerHeight - 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        <DeferredTicketInstructionsContentWithNavigation
          ticketParams={props.route.params}
        />
        <OverscrollView />
      </AnimatedScrollView>
    </View>
  );
}

function DeferredTicketInstructionsContent(props) {
  const params = props.ticketParams || {};
  const ticket = params.ticket;
  return (
    <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
      <Card>
        <CardContent>
          <Title>{ticket.firstName + ' ' + ticket.lastName} </Title>
          <Title>Ticket Ref: {ticket.ref} </Title>
          <Markdown styles={markdownStyles}>{ticket.mobileMessage}</Markdown>
        </CardContent>
      </Card>
      <Button raised onPress={() => props.navigation.goBack()}>
        Close
      </Button>
    </AnimatableView>
  );
}

const DeferredTicketInstructionsContentWithNavigation = withNavigation(
  DeferredTicketInstructionsContent
);

const OverscrollView = () => (
  <View
    style={{
      position: 'absolute',
      top: -400,
      height: 400,
      left: 0,
      right: 0,
      backgroundColor: Colors.blue,
    }}
  />
);

const markdownStyles = {
  text: {},
};

export default withHeaderHeight(TicketInstructions);
