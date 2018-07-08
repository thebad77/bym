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
    Icon
} from '@shoutem/ui';

export class TmpScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Screen>
                <NavigationBar
                    title="TmpScreen"
                    styleName="inline"
                />
                <Button
                    styleName="light"
                    tyle={{ fontSize: 30 }}
                    onPress={() => this.listPressed()}>
                    <Text>Playlist list</Text>
                </Button>
                <Button
                    onPress={() => this.qrCodePressed()}>
                    <Text>QrCode</Text>
                </Button>
            </Screen>
        );
    }

    listPressed() {
        this.props.navigation.navigate('PlayLists');
    }
    
    qrCodePressed() {
	this.props.navigation.navigate('ScanQrCode');
    }
}