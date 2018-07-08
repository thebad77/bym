import React, { Component } from "react";
import { StackNavigator } from 'react-navigation';
import {
    Button,
    Screen,
    Tile,
    Title,
    Divider,
    NavigationBar,
    Text
} from '@shoutem/ui';

export class LoginScreen extends Component {

	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
    }
    
    render() {
        return (
            <Screen style={{ alignItems: "center", justifyContent: "center" }}>
                <Title>BYM</Title>
                <Divider/>
                <Button
                    styleName="light"
                    tyle={{ fontSize: 30 }}
                    onPress={() => this.loginPressed()}>
                    <Text>Login</Text>
                </Button>
                <Button
                    onPress={() => this.signUpPressed()}>
                    <Text>Sign up</Text>
                </Button>
            </Screen>
        );
    }

    loginPressed() {
        //this.props.navigation.navigate('ScanQrCode');
        //this.props.navigation.navigate('PlayLists');
        this.props.navigation.navigate('Tmp');
    }
    
    signUpPressed() {
        
    }
}