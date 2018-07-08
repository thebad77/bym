import React, { Component } from "react";
import { StackNavigator } from 'react-navigation';
import QRCode from 'react-native-qrcode';
import {
    Button,
    Screen,
    Tile,
    Title,
    Divider,
    NavigationBar,
    Text,
    Icon,
    View
} from '@shoutem/ui';

export class QrCodeScreen extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.playlist = this.props.navigation.state.params.playlist;
    }

    render() {
        return (
            <Screen style={{backgroundColor: "#FFFFFF"}}>
                <NavigationBar
                    title="QRCode"
                    styleName="inline"
                    leftComponent={(
                        <Button
                            styleName="clear"
                            onPress={() => this.props.navigation.pop()}>
                            <Icon name="left-arrow" />
                        </Button>
                    )}
                />
                <View
                    style={{flex: 1, marginTop: 20, justifyContent: 'center', alignItems: 'center'}}
                >
                    <QRCode
                        value={this.playlist.key}
                        size={350}
                        bgColor='black'
                        fgColor='white' />
                </View>
            </Screen>
        );
    }
}