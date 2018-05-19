import React from 'react'
import {
  Animated,
  Linking,
  Platform,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  View
} from 'react-native'
import { Asset, LinearGradient, WebBrowser, Video } from 'expo'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { NavigationActions } from 'react-navigation'
import FadeIn from 'react-native-fade-in-image'
import { View as AnimatableView } from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons'
import { withNavigation } from 'react-navigation'

import AnimatedScrollView from '../components/AnimatedScrollView'
import MyContacts from '../components/MyContacts'
import NavigationBar from '../components/NavigationBar'
import MenuButton from '../components/MenuButton'
import VideoBackground from '../components/VideoBackground'
import { BoldText, SemiBoldText } from '../components/StyledText'
import { connectDrawerButton } from '../Navigation'
import { Colors, FontSizes, Layout } from '../constants'
import { Speakers, Talks } from '../data'
import {
  HideWhenConferenceHasStarted,
  HideWhenConferenceHasEnded,
  ShowWhenConferenceHasEnded
} from '../utils'
export const Schedule = require('../data/schedule.json')
const Event = Schedule.events[0]

class Contacts extends React.Component {
  state = {
    scrollY: new Animated.Value(0)
  }

  render() {
    const { scrollY } = this.state
    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    return (
      <View style={{ flex: 1 }}>
        <AnimatedScrollView
          style={{ flex: 1 }}
          // contentContainerStyle={{ paddingBottom: 20 + Layout.notchHeight / 2 }}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: scrollY } }
              }
            ],
            { useNativeDriver: true }
          )}
        >
          <DeferredContactsContent />
          <OverscrollView />
        </AnimatedScrollView>
      </View>
    )
  }
}

@withNavigation
class DeferredContactsContent extends React.Component {
  state = {
    ready: Platform.OS === 'android' ? false : true,
    tickets: []
  }

  async getTickets() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:tickets')
      console.log('tickets', value)
      this.setState({ tickets: JSON.parse(value) })
      this.tickets = JSON.parse(value)
    } catch (err) {
      console.log(err)
      return []
    }
  }

  constructor(props) {
    super(props)
    this.tickets = []
  }

  componentDidMount() {
    this.getTickets()
    if (this.state.ready) {
      return
    }

    setTimeout(() => {
      this.setState({ ready: true })
    }, 200)
  }

  render() {
    if (!this.state.ready) {
      return null
    }
    console.log('state', this.state)
    const tix = this.state.tickets || []
    return (
      <AnimatableView animation="fadeIn" useNativeDriver duration={800}>
        <MyContacts
          tickets={this.state.tickets}
          style={{ marginTop: 20, marginHorizontal: 15, marginBottom: 2 }}
        />
        {tix && tix.length > 0 ? (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressQRButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                Scan a contact badge's QR code
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        ) : (
          <ClipBorderRadius>
            <RectButton
              style={styles.bigButton}
              onPress={this._handlePressProfileQRButton}
              underlayColor="#fff"
            >
              <SemiBoldText style={styles.bigButtonText}>
                You need to scan your ticket first
              </SemiBoldText>
            </RectButton>
          </ClipBorderRadius>
        )}
      </AnimatableView>
    )
  }

  _handlePressQRButton = () => {
    this.props.navigation.navigate({
      routeName: 'QRContactScanner',
      key: 'QRContactScanner'
    })
  }

  _handlePressProfileQRButton = () => {
    this.props.navigation.navigate({
      routeName: 'QRScanner',
      key: 'QRScanner'
    })
  }

  _handlePressTwitterButton = async () => {
    try {
      await Linking.openURL(`twitter://user?screen_name=` + Event.twitterHandle)
    } catch (e) {
      WebBrowser.openBrowserAsync('https://twitter.com/' + Event.twitterHandle)
    }
  }
}

const OverscrollView = () => (
  <View
    style={{
      position: 'absolute',
      top: -400,
      height: 400,
      left: 0,
      right: 0,
      backgroundColor: Colors.blue
    }}
  />
)

const ClipBorderRadius = ({ children, style }) => {
  return (
    <View style={[{ borderRadius: BORDER_RADIUS, overflow: 'hidden' }, style]}>
      {children}
    </View>
  )
}

const BORDER_RADIUS = 3

const styles = StyleSheet.create({
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 17 * 1.5
  },
  headerSmallText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 7,
    lineHeight: 7 * 1.5
  },
  bigButton: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  bigButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center'
  },
  seeAllTalks: {
    fontSize: FontSizes.normalButton,
    color: Colors.blue
  }
})

export default Contacts
