import React, { Component } from "react";
import { Alert } from "react-native";
import { StackNavigator } from 'react-navigation';
import ActionButton from 'react-native-action-button';
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
    Image,
    Card,
    Caption,
    ImageBackground,
    Overlay,
    TouchableOpacity,
} from '@shoutem/ui';
import * as firebase from 'firebase';

export class PlaylistScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.playlist = this.props.navigation.state.params.playlist;
        this.title = this.playlist.val().name;
        this.magic_token = "BQBYgWDtG2Q3Mu90Pqg3BiCb_jpvZh1T3Mp2HVzkLmjP7vf6yRPIarzMm0vQ5fKpQNp-AFCWNLBfHSFDCR40LpZw4ipd5Z9969gBhN8zjp1r5lDhF4zFjklc0vqTlMfvFyk2NJrjYwTJZqrOgwZM4sB_X8g5POxBsnQEiwkN3rM92HBeIZQ_-pD_cnkKbcMYtSvbcpHWnWLei0NSNZooSfydErkF5y8mUp4JdJ-fIhBVwHKFy66-vvtPF851BNvtM0NYoz3g";

        this.state = {
            currentTrack: {},
            tracks: [],
            loaded: false,
            playState: "play"
        };
    }

    componentDidMount() {
        let that = this;
        let tracks = [...this.state.tracks]
        firebase.database().ref('/playlists/' + this.playlist.key + '/tracks').on('child_added', (data) => {
            data.like = data.val().like;
            tracks.push(data);
            tracks = tracks.sort((a, b) => b.like - a.like);
            that.setState({
                tracks: tracks,
                currentTrack: tracks[0],
                loaded: true
            });
        });

        firebase.database().ref('/playlists/' + this.playlist.key + '/tracks').on('child_changed', (data) => {
            let new_tracks = []
            for (let i = 0; i < that.state.tracks.length; ++i) {
                if (that.state.tracks[i].val().id == data.val().id) {
                    that.state.tracks[i].like = data.val().like;
                }
                new_tracks.push(that.state.tracks[i]);
            }
            new_tracks = new_tracks.sort((a, b) => b.like - a.like);
            that.setState({
                tracks: new_tracks,
                currentTrack: new_tracks[0]
            });
        });
    }

    renderRow(track) {
        return (
            <Row>
                <Image
                    styleName="medium-square"
                    source={{ uri: track.val().image }}
                />
                <View styleName="vertical">
                    <Subtitle>{track.val().name}</Subtitle>
                    <Text numberOfLines={1}>{track.val().artist}</Text>
                    <TouchableOpacity onPress={() => { this.likePressed(track) }}>
                        <Icon name="like" />
                        <Text>{track.like}</Text>
                    </TouchableOpacity>
                </View>
                <Divider styleName="line" />
            </Row>
        );
    }

    render() {
        if (this.state.loaded) {
            return (
                <Screen>
                    <NavigationBar
                        title={this.title}
                        styleName="inline"
                        rightComponent={(
                            <Button
                                styleName="clear"
                                onPress={() => this.showQrCode()}>
                                <Icon name="share-android" />
                            </Button>
                        )}
                        leftComponent={(
                            <Button
                                styleName="clear"
                                onPress={() => this.props.navigation.pop()}>
                                <Icon name="left-arrow" />
                            </Button>
                        )}
                    />
                    <ImageBackground
                        styleName="large"
                        source={{ uri: this.state.currentTrack.val().image }}
                    >
                        <Tile>
                            <Overlay styleName="content">
                                <TouchableOpacity style={{ backgroundColor: '#DDDDDD' }} onPress={() => this.playPressed(this.currentTrack)}>
                                    <Icon name={this.state.playState} />
                                </TouchableOpacity>
                                <Subtitle>{this.state.currentTrack.val().name}</Subtitle>
                                <Caption>{this.state.currentTrack.val().artist}</Caption>
                            </Overlay>
                        </Tile>
                    </ImageBackground>
                    <ListView
                        data={this.state.tracks}
                        renderRow={(track) => this.renderRow(track)}
                    />
                    <ActionButton
                        buttonColor="rgba(231,76,60,1)"
                        onPress={() => this.addTrackPressed()}
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
                                onPress={() => this.addTrackPressed()}>
                                <Icon name="plus-button" />
                            </Button>
                        )}
                    />
                    <ListView
                        data={this.state.tracks}
                        renderRow={(track) => this.renderRow(track)}
                    />
                </Screen>
            );
        }
    }

    addTrackPressed() {
        this.props.navigation.navigate('AddTrack', { playlist: this.playlist });
    }

    showQrCode() {
        this.props.navigation.navigate('QRCode', { playlist: this.playlist });
    }

    likePressed(track) {
        firebase.database().ref('/playlists/' + this.playlist.key + '/tracks').child(track.key).update({ like: track.like + 1 });
    }

    async playMusic(track) {
        try {
            await fetch('https://api.spotify.com/v1/me/player/play', {
                method: 'PUT',
                headers: {
                    "Authorization": " Bearer " + this.magic_token
                },
                body: JSON.stringify({
                    uris: ["spotify:track:" + this.state.currentTrack.val().id]
                }),
            });
        } catch (error) {

        }
    }

    async pauseMusic() {
        try {
            await fetch('https://api.spotify.com/v1/me/player/pause', {
                method: 'PUT',
                headers: {
                    "Authorization": " Bearer " + this.magic_token
                }
            });
        } catch (error) {

        }
    }

    playPressed(track) {
        if (this.state.playState == "play") {
            this.setState({ playState: "pause" });
            this.playMusic(track);
        } else {
            this.setState({ playState: "play" });
            this.pauseMusic();
        }
    }

}