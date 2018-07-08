import React, { Component } from "react";
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
    TouchableOpacity
} from '@shoutem/ui';
import * as firebase from 'firebase';

export class PlayListsScreen extends Component {

	static navigationOptions = {
		header: null,
	};

	constructor(props) {
        super(props);
        
        this.state = {
           playlists: []
        };
    }

    componentDidMount() {
        let that = this;
        firebase.database().ref('/playlists').on('child_added', (data) => {
                
            var newData = [...that.state.playlists];
            newData.push(data);
            that.setState({ playlists: newData });
        });
    }

    renderRow(playlist) {
        return (
            <TouchableOpacity onPress={() => {this.playlistSelected(playlist)}}>
                <Title styleName="md-gutter-bottom">{playlist.val().name}</Title>
                <Subtitle styleName="sm-gutter-horizontal">Created by: {playlist.val().creator}</Subtitle>
                <Divider styleName="line" />
            </TouchableOpacity>
          );
    }
    
    render() {
        return (
            <Screen>
                <NavigationBar
                    title="Playlists"
                    rightComponent={(
                        <Button
                            styleName="clear"
                            onPress={() => this.addPlaylistPressed()}>
                            <Text>Add</Text>
                        </Button>
                    )}
                    styleName="inline"
                />
                <ListView
                    data={this.state.playlists}
                    renderRow={(playlist) => this.renderRow(playlist)}
                />
            </Screen>
        );
    }

    addPlaylistPressed() {
        this.props.navigation.navigate('AddPlaylist');
    }

    playlistSelected(playlist) {
        this.props.navigation.navigate('Playlist', {playlist: playlist});
    }
}