import React from 'react';
import {
  View,
  Text,
  ListView,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  PixelRatio,
  ScrollView,
  Image
} from 'react-native';
import SendBird from 'sendbird';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6E5BAA',
    paddingTop: 20,
  },
  chatContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#6E5BAA'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  sendContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  sendLabel: {
    color: '#ffffff',
    fontSize: 15
  },
  input: {
    width: 300,
    color: '#555555',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: '#6E5BAA',
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  channelIcon: {
    width: 30,
    height: 30
  },
});

let sb = null;

export default class Chat extends React.Component {

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      channel: this.props.route.channel,
      dataSource: ds.cloneWithRows([]),
      message: '',
      messageList: [],
      messageListQuery: this.props.route.channel.createPreviousMessageListQuery()
    }

    sb = SendBird.getInstance();
    this.onBackPress = this.onBackPress.bind(this);
    this.onSendPress = this.onSendPress.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount() {
    var _SELF = this;
    var ChannelHandler = new sb.ChannelHandler();
    ChannelHandler.onMessageReceived = function(channel, message) {
      console.log('message received:',message);
    }
    sb.addChannelHandler('message_received', ChannelHandler);
    this.getMessages();
  }

  getMessages() {
    var _SELF = this;
    this.state.messageListQuery.load(30, true, function (_messageList, error) {
      if(error){
        console.warn(error);
      }
      console.log(_messageList);
      _SELF.setState({
        messageList: _messageList.concat(_SELF.state.messageList).reverse()
      })
    });

  }

  onBackPress() {
    this.props.navigator.pop();
  }

  onSendPress() {
    var _SELF = this;
    if (!_SELF.state.message){
      return;
    }
    console.log('sending ' + _SELF.state.message + ' to channel ', _SELF.state.channel);
    _SELF.state.channel.sendUserMessage(_SELF.state.message, '', function(message, error) {
      if (error) {
        console.log(error);
        return;
      }

      var _messages = [];
      _messages.push(message);
      console.log('send success');
      var _newMessageList = _SELF.state.messageList.concat(_messages);
      _SELF.setState({
        messageList: _newMessageList,
        dataSource: _SELF.state.dataSource.cloneWithRows(_newMessageList)
      });
    });
    this.setState({
      message: ''
    });
  }

  render() {
    var list = this.state.messageList.map((item, index) => {
      console.log('item:',item);
      return (
        <View
          style={styles.messageContainer}
          key={index}
          >
          <View style={styles.listIcon}>
            <Image style={styles.channelIcon} source={{uri: item.sender.profileUrl}} />
          </View>
          <Text style={this.nameLabel}>
            {item.sender.nickname}
            <Text style={styles.messageLabel}> : {item.message}</Text>
          </Text>
        </View>
      );
    });
    console.log(list);
    console.log('state: ', this.state);
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableHighlight
            underlayColor={'#4e4273'}
            onPress={this.onBackPress}
            style={{marginLeft: 15}}
            >
            <Text style={{color: '#fff'}}>&lt; Back</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.chatContainer}>
          <ScrollView
            ref={(c) => this._scrollView = c}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={(e) => {}}
          >
          {list}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.input}
              value={this.state.message}
              onChangeText={(text) => this.setState({message: text})}
              />
          </View>
          <View style={styles.sendContainer}>
            <TouchableHighlight
              underlayColor={'#4e4273'}
              onPress={() => this.onSendPress()}
              >
              <Text style={styles.sendLabel}>SEND</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}
