import React from 'react';
import { StyleSheet } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';
import Login from '../components/login.js';
import Channels from '../components/channels.js';
import Chat from '../components/chat.js';
import SendBird from 'sendbird';

var ROUTES = {
  login: Login,
  channels: Channels,
  chat: Chat
};

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var sb = null;

export default class Main extends React.Component {

  componentDidMount() {
    // initialize sendbird
    sb = new SendBird({appId: '1FB1DE40-798E-4F26-AF49-FD52AD87192E'})
  }

  renderScene(route,navigator) {
    console.log('nav', navigator);
    console.log('route', route);
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  }

  render() {
    console.log('render main');
    return (
      <NavigationExperimental.Navigator
        style={ styles.container }
        initialRoute={ {name: 'login'} }
        renderScene={this.renderScene}
        configureScene={ () => { return NavigationExperimental.Navigator.SceneConfigs.FloatFromRight; } }
      />
    )
  }
}
