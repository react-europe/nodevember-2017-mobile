import React from 'react';
import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {withNavigation, SafeAreaView} from 'react-navigation';

class QRScreen extends React.Component {
  state = {
    showQRScanner: true,
    hasCameraPermission: null,
  };

  componentDidMount() {
    this._requestCameraPermission();
    this.didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
      payload => {
        console.debug('didBlur', payload);
        this.setState({showQRScanner: false});
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        console.debug('didfocus', payload);
        this.setState({showQRScanner: true});
      }
    );
  }

  componentWillUnmount() {
    this.didBlurSubscription && this.didBlurSubscription.remove();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }

  _requestCameraPermission = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _onBarCodeRead = data => {
    this.setState({showQRScanner: false}, () => {
      this.props.onBarCodeScanned(data);
    });
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        {this.state.showQRScanner && this.state.hasCameraPermission ? (
          <BarCodeScanner
            onBarCodeScanned={this.props.loading ? null : this._onBarCodeRead}
            style={{flex: 1}}
          />
        ) : null}

        <SafeAreaView
          forceInset={{top: 'always'}}
          style={{position: 'absolute', top: 0, left: 0, right: 0}}>
          <Text
            style={{
              fontSize: 20,
              marginTop: Platform.OS === 'ios' ? 15 : 40,
              textAlign: 'center',
              color: '#fff',
            }}>
            {this.props.title}
          </Text>
        </SafeAreaView>

        <SafeAreaView
          forceInset={{bottom: 'always'}}
          style={{
            position: 'absolute',
            bottom: 10,
            paddingBottom: Platform.OS === 'ios' ? 0 : 15,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <Button
            onPress={() => this.props.navigation.goBack()}
            color={Platform.OS === 'ios' ? '#fff' : null}
            title="Dismiss"
          />
        </SafeAreaView>
        {this.props.loading ? (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              },
            ]}>
            <ActivityIndicator
              color="#fff"
              size="large"
              style={{backgroundColor: 'transparent'}}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

export default withNavigation(QRScreen);
