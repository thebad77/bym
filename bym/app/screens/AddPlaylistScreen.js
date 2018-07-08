import React, { Component } from "react";
import { StackNavigator } from 'react-navigation';
import {
    Button,
    Screen,
    Tile,
    Title,
    Divider,
    NavigationBar,
    Text,
    ListView,
    TextInput
} from '@shoutem/ui';
import * as firebase from 'firebase';

export class AddPlaylistScreen extends Component {

	static navigationOptions = {
		header: null,
	};

	constructor(props) {
        super(props);

        this.state = {
            name: "",
            creator: ""
        }
    }
    
    render() {
        return (
            <Screen>
                <NavigationBar
                    title="New playlist"
                    styleName="inline"
                />
                <TextInput
                    placeholder={'Playlist name'}
                    onChangeText={(text) => this.nameChanged(text)}
                />
                <TextInput
                    placeholder={'Creator name'}
                    onChangeText={(text) => this.creatorChanged(text)}
                />
                <Button
                    styleName="secondary"
                    onPress={() => this.submitPlaylist()}>
                    <Text>Submit</Text>
                </Button>
            </Screen>
        );
    }

    nameChanged(text) {
        this.setState({
            name: text,
            creator: this.state.creator
        });
        
    }

    creatorChanged(text) {
        this.setState({
            name: this.state.name,
            creator: text
        });
    }

    submitPlaylist() {
        var key = firebase.database().ref('/playlists').push().key
        firebase.database().ref('/playlists').child(key).set({
            name: this.state.name,
            creator: this.state.creator
        })
        let that = this;
        firebase.database().ref('/playlists/' + key).once('value').then(function(snapshot) {
            that.props.navigation.navigate('Playlist', {playlist: snapshot});
        });
    }
}