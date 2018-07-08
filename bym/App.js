import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import * as firebase from 'firebase';

import { LoginScreen } from './app/screens/LoginScreen';
import { PlayListsScreen } from './app/screens/PlayListsScreen';
import { AddPlaylistScreen } from './app/screens/AddPlaylistScreen';
import { PlaylistScreen } from './app/screens/PlaylistScreen';
import { AddTrackScreen } from './app/screens/AddTrackScreen';
import { ScanQrCodeScreen } from './app/screens/ScanQrCodeScreen';
import { QrCodeScreen } from './app/screens/QrCodeScreen';
import { TmpScreen } from './app/screens/TmpScreen';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAkeNnlWHgISFNfxUOmz8hWDOQ8Ul9VPhg",
  authDomain: "bymapp-5fbee.firebaseapp.com",
  databaseURL: "https://bymapp-5fbee.firebaseio.com",
  projectId: "bymapp-5fbee",
  storageBucket: "bymapp-5fbee.appspot.com",
  messagingSenderId: "1092058334382"
};
firebase.initializeApp(config);

// Hide errors
console.disableYellowBox = true;

const RootStack = StackNavigator({
    Login: {
      screen: LoginScreen
    },
    PlayLists: {
      screen: PlayListsScreen
    },
    AddPlaylist: {
      screen: AddPlaylistScreen
    },
    Playlist: {
      screen: PlaylistScreen
    },
    AddTrack: {
      screen: AddTrackScreen
    },
    ScanQrCode: {
      screen: ScanQrCodeScreen
    },
    QRCode: {
      screen: QrCodeScreen
    },
    Tmp: {
      screen: TmpScreen
    }
  },
  {
    initialRouteName: 'Login',
    animationEnabled : true,
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
