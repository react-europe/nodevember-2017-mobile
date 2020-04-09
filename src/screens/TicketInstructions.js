import * as React from 'react';
import {Animated, Platform, View, AsyncStorage} from 'react-native';
import {View as AnimatableView} from 'react-native-animatable';

import {withNavigation} from '../utils/withNavigation';
import AnimatedScrollView from '../components/AnimatedScrollView';
import {Colors, Layout} from '../constants';
import {Button, Card, CardContent, Title} from 'react-native-paper';
import Markdown from 'react-native-markdown-renderer';
import withHeaderHeight from '../utils/withHeaderHeight';

class TicketInstructions extends React.Component {
  state = {
    scrollY: new Animated.Value(0),
  };

  render() {
    const {scrollY} = this.state;

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
              paddingTop: this.props.headerHeight - 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />

          <DeferredTicketInstructionsContentWithNavigation
            ticketParams={this.props.route.params}
          />
          <OverscrollView />
        </AnimatedScrollView>
      </View>
    );
  }
}

class DeferredTicketInstructionsContent extends React.Component {
  state = {
    tickets: [],
    ready: Platform.OS === 'android' ? false : true,
  };
  async getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore2019:tickets');
      this.setState({tickets: JSON.parse(value)});
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  constructor(props) {
    super(props);
    this.getTickets();
  }

  componentDidMount() {
    if (this.state.ready) {
      return;
    }

    setTimeout(() => {
      this.setState({ready: true});
    }, 200);
  }

  render() {
    const params = this.props.ticketParams || {};
    const ticket = params.ticket;
    console.log('params', params);
    if (!this.state.ready) {
      return null;
    }

    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <Card>
          <CardContent>
            <Title>{ticket.firstName + ' ' + ticket.lastName} </Title>
            <Title>Ticket Ref: {ticket.ref} </Title>
            <Markdown styles={markdownStyles}>{ticket.mobileMessage}</Markdown>
          </CardContent>
        </Card>
        <Button raised onPress={() => this.props.navigation.goBack()}>
          Close
        </Button>
      </AnimatableView>
    );
  }
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
