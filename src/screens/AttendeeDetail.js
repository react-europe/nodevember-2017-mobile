import React from 'react'
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { View as AnimatableView } from 'react-native-animatable'
import { Button } from 'react-native-paper'
import { Constants } from 'expo'
import FadeIn from 'react-native-fade-in-image'
import _ from 'lodash'

import AnimatedScrollView from '../components/AnimatedScrollView'
import NavigationBar from '../components/NavigationBar'
import { Colors, FontSizes, Layout } from '../constants'
import { RegularText, SemiBoldText } from '../components/StyledText'
import GravatarImage from '../components/GravatarImage'
import CloseButton from '../components/CloseButton'
export const Schedule = require('../data/schedule.json')
import { sendEmail, openTwitter, addContact, getContactTwitter } from '../utils'

export default class AttendeeDetail extends React.Component {
  static navigationOptions = {
    title: 'Attendee Details'
  }

  state = {
    scrollY: new Animated.Value(0)
  }

  _handlePressTwitter = () => {
    const { attendee } = this.props.navigation.state.params
    const twitter = getContactTwitter(attendee)
    openTwitter(twitter)
  }

  _handlePressEmail = () => {
    const {
      attendee: { email: emailTo }
    } = this.props.navigation.state.params
    const { tickets } = this.props
    let fromName = { firstName: '', lastName: '' }
    if (tickets && tickets[0] && tickets[0].firstName) {
      fromName = tickets[0]
    }
    sendEmail(emailTo, fromName)
  }

  _handleAddToContacts = async () => {
    const { navigation } = this.props
    const { attendee } = navigation.state.params
    await addContact(attendee)
    navigation.navigate('Contacts')
  }

  render() {
    const params = this.props.navigation.state.params || {}
    const attendee = params.attendee

    if (!attendee || !_.has(attendee, 'email')) {
      this.props.navigation.goBack()
      return null
    }

    const twitter = getContactTwitter(attendee)

    const { scrollY } = this.state
    const scale = scrollY.interpolate({
      inputRange: [-300, 0, 1],
      outputRange: [2, 1, 1],
      extrapolate: 'clamp'
    })
    const translateX = 0
    const translateY = scrollY.interpolate({
      inputRange: [-300, 0, 1],
      outputRange: [-50, 1, 1],
      extrapolate: 'clamp'
    })

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 30, 200],
      outputRange: [0, 0, 1]
    })

    return (
      <View style={{ flex: 1, backgroundColor: '#fff', overflow: 'hidden' }}>
        {Platform.OS === 'ios' ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: -350,
              left: 0,
              right: 0,
              height: 400,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [1, 0, 0]
                  })
                }
              ],
              backgroundColor: Colors.blue
            }}
          />
        ) : null}
        <AnimatedScrollView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this.state.scrollY } }
              }
            ],
            { useNativeDriver: true }
          )}
        >
          <View style={styles.headerContainer}>
            <Animated.View
              style={{ transform: [{ scale }, { translateX }, { translateY }] }}
            >
              <FadeIn placeholderStyle={{ backgroundColor: 'transparent' }}>
                <GravatarImage style={styles.avatar} email={attendee.email} />
              </FadeIn>
            </Animated.View>
            <SemiBoldText style={styles.headerText} key={attendee.id}>
              {attendee.firstName} {attendee.lastName}
            </SemiBoldText>
            {twitter ? (
              <TouchableOpacity onPress={this._handlePressTwitter}>
                <RegularText style={styles.headerText}>@{twitter}</RegularText>
              </TouchableOpacity>
            ) : null}
            {attendee && attendee.email ? (
              <TouchableOpacity onPress={this._handlePressEmail}>
                <RegularText style={styles.headerText}>
                  {attendee.email}
                </RegularText>
              </TouchableOpacity>
            ) : null}
          </View>
          <AnimatableView
            animation="fadeIn"
            useNativeDriver
            delay={50}
            duration={250}
            style={styles.content}
          >
            <View>
              <Button raised primary onPress={this._handleAddToContacts}>
                Add to contacts
              </Button>
            </View>
          </AnimatableView>
        </AnimatedScrollView>

        <NavigationBar
          animatedBackgroundOpacity={headerOpacity}
          style={[
            Platform.OS === 'android'
              ? { height: Layout.headerHeight + Constants.statusBarHeight }
              : null
          ]}
          renderLeftButton={() => (
            <View
              style={{
                // gross dumb things
                paddingTop: Platform.OS === 'android' ? 30 : 0,
                marginTop: Layout.notchHeight > 0 ? -5 : 0
              }}
            />
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10
  },
  content: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerContainer: {
    backgroundColor: Colors.blue,
    paddingTop: Constants.statusBarHeight + Layout.notchHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: '#fff',
    fontSize: FontSizes.subtitle
  }
})
