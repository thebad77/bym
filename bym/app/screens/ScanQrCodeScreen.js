import React, { Component } from "react";
import { Alert, StyleSheet } from "react-native";
import { StackNavigator } from 'react-navigation';
import {
  Button,
  Screen,
  Icon,
  Text,
  TouchableOpacity,
  NavigationBar
} from '@shoutem/ui';
import * as firebase from 'firebase';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RNCamera from 'react-native-camera';

export class ScanQrCodeScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      camera: false,
      playlists: []
    }
    this.title = "QRCode";
  }

  componentDidMount() {
    this.setState({ camera: true })
    let that = this;
    firebase.database().ref('/playlists').on('child_added', (data) => {

      var newData = [...that.state.playlists];
      newData.push(data);
      that.setState({ playlists: newData });
    });
  }

  render() {
    if (!this.state.camera) {
      return (
        <Screen>
          <NavigationBar
            title={this.title}
            styleName="inline"
            rightComponent={(
              <Button
                styleName="clear"
              >
                <Icon name="plus-button" />
              </Button>
            )}
          />
        </Screen>
      );
    } else {
      return (
        <Screen>
          <NavigationBar
            title={this.title}
            styleName="inline"
            rightComponent={(
              <Button
                styleName="clear"
                onPress={() => this.addPlaylistPressed()}>
                <Icon name="plus-button" />
              </Button>
            )}
          />
          <RNCamera
            style={styles.preview}
            onBarCodeRead={(e) => this.onSuccess(e)}
            ref={cam => this.camera = cam}
            aspect={RNCamera.constants.Aspect.fill}
          >
          </RNCamera>
        </Screen>
      );
    }
  }

  addPlaylistPressed() {
    this.props.navigation.navigate('AddPlaylist');
  }

  onSuccess(e) {
    let playlist = null
    for (let i = 0; i < this.state.playlists.length; ++i) {
      if (this.state.playlists[i].key == e.data) {
        playlist = this.state.playlists[i];
      }
    }
    if (playlist == null) {
      Alert.alert(
        'QRCode',
        'Playlist not found',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    } else {
      this.props.navigation.navigate('Playlist', { playlist: playlist });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});