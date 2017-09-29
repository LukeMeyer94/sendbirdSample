/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Main from './src/main';

export default class sendBirdSample extends React.Component {
  render() {
    return (
      <Main />
    );
  }
}
AppRegistry.registerComponent('sendBirdSample', () => sendBirdSample);
