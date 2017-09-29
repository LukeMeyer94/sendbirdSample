import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import SendBird from 'sendbird';

var sb = null;


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#6E5BAA'
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    marginTop: 50,
    borderColor: '#32C5E6',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#328FE6',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#32c5e6'
  },
  label: {
    width: 230,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff'
  }
});

export default class Login extends React.Component {

  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      username: ''
    }
    this.onPress = this.onPress.bind(this);
  }

  render () {
    console.log('render login');
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            value={this.state.username}
            onChangeText={(text) => this.setState({username: text})}
            placeholder={'Enter User Nickname'}
            maxLength={12}
            multiline={false}
            />

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.onPress}
            >
            <Text style={styles.label}>LOGIN</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }


  onPress() {
    console.log(this.state.username);
    sb = SendBird.getInstance();
    console.log(this.state);
    var _SELF = this;
    // sendbird connect
    sb.connect(_SELF.state.username, function (user, error) {
      if (error) {
        _SELF.setState({
          userId: '',
          username: '',
          errorMessage: 'Login Error'
        });
        console.log(error);
        return;
      }
      console.log('success');
      if (sb.getPendingAPNSToken()){
        sb.registerAPNSPushTokenForCurrentUser(sb.getPendingAPNSToken(), function(result, error){
          console.log("APNS TOKEN REGISTER AFTER LOGIN");
          console.log(result);
        });
      }

      sb.updateCurrentUserInfo(_SELF.state.username, '', function(response, error) {
        _SELF.setState({
          buttonDisabled: false,
          connectLabel: 'DISCONNECT',
          errorMessage: ''
        });
      });
      _SELF.props.navigator.push({ name: 'channels' });
    });
  }
}
