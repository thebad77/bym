import React, { Component } from "react";
import { Alert } from "react-native";
import { StackNavigator } from 'react-navigation';
import {
    Button,
    Screen,
    Tile,
    Title,
    Subtitle,
    Divider,
    NavigationBar,
    Text,
    ListView,
    View,
    Row,
    Icon,
    TextInput,
    Image,
    TouchableOpacity
} from '@shoutem/ui';
import * as firebase from 'firebase';
import { Buffer } from 'buffer';

export class AddTrackScreen extends Component {

	static navigationOptions = {
		header: null,
	};

	constructor(props) {
        super(props);

        this.client_id = "c4eb06f92a644882a45a63343213c0f5";
        this.client_secret = "665bbdbebbcf436083dd2420224ec3a2";
        this.playlist = this.props.navigation.state.params.playlist;
        this.title = "Add track";
        
        this.state = {
            tracks: []
        };
    }

    async componentWillMount() {
        const res = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                Authorization: "Basic " + Buffer.from(this.client_id + ":" + this.client_secret).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });
        const json = await res.json();
        this.token = json.access_token;
    }

    componentDidMount() {
        let that = this;
        firebase.database().ref('/playlists').child(this.playlist.key).on('child_added', (data) => {
                
            var newData = [...that.state.tracks];
            newData.push(data);
            that.setState({ tracks: newData });
        });
    }

    renderRow(track) {
        return (
            <TouchableOpacity onPress={() => this.addTrackToPlaylist(track)}>
                <Row>
                    <Image
                        styleName="medium-square"
                        source={{ uri: track.image }}
                    />
                    <View styleName="vertical">
                        <Subtitle>{track.name}</Subtitle>
                        <Text numberOfLines={1}>{track.artist}</Text>
                    </View>
                    <Divider styleName="line" />
                </Row>
            </TouchableOpacity>
          );
    }

    addTrackToPlaylist(track) {
        var key = firebase.database().ref('/playlists/' + this.playlist.key + '/tracks').push().key
        firebase.database().ref('/playlists/' + this.playlist.key + '/tracks').child(key).set(track)
        Alert.alert(
            'Music added',
            track.name + ' was added to playlist !',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
    }
    
    render() {
        return (
            <Screen>
                <NavigationBar
                    title={this.title}
                    styleName="inline"
                    leftComponent={(
                        <Button
                            styleName="clear"
                            onPress={() => this.props.navigation.pop()}>
                            <Icon name="left-arrow" />
                        </Button>
                    )}
                />
		        <TextInput
                    placeholder={'Search track'}
                    onChangeText={(text) => this.searchTrack(text)}
                />
                <ListView
                    data={this.state.tracks}
                    renderRow={(track) => this.renderRow(track)}
                />
            </Screen>
        );
    }

    async searchTrack(text) {
        const res = await fetch("https://api.spotify.com/v1/search?q=" + encodeURI(text) + "&type=track&access_token=" + this.token, {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {    
            const items = responseJson.tracks ? responseJson.tracks.items : [];
            let good_items = [];
            for (let i = 0; i < responseJson.tracks.items.length; ++i) {
                good_items.push({
                    name: responseJson.tracks.items[i].name,
                    id: responseJson.tracks.items[i].id,
                    image: responseJson.tracks.items[i].album.images[0].url,
                    artist: responseJson.tracks.items[i].album.artists[0].name,
                    duration_ms: responseJson.tracks.items[i].duration_ms,
                    like: 0
                })
            }
            this.setState({ 
                tracks: good_items,
                isLoaded: true
            });    
        })
    }

}