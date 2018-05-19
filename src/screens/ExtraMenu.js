import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  Platform,
  Constants,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import Navigationbar from '../components/NavigationBar'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constants'

class MenuScreen extends Component {
  static navigationOptions = {
    title: 'Menu',
    headerTintColor: 'white'
  }

  getIconName = key => {
    if (key === 'Speakers') return 'ios-microphone'
    if (key === 'Crew') return 'ios-information-circle'
    if (key === 'Sponsors') return 'ios-beer'
  }

  render() {
    return (
      <FlatList
        data={[{ key: 'Speakers' }, { key: 'Crew' }, { key: 'Sponsors' }]}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: '#cdcdcd'
            }}
          />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate(item.key)}
          >
            <View
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Ionicons
                name={`${this.getIconName(item.key)}`}
                size={24}
                color={Colors.blue}
              />
              <Text style={{ fontSize: 20, marginHorizontal: 16, flex: 1 }}>
                {item.key}
              </Text>
              <Ionicons
                name="ios-arrow-forward-outline"
                size={24}
                color="#999"
              />
            </View>
          </TouchableOpacity>
        )}
      />
    )
  }
}

export default MenuScreen
