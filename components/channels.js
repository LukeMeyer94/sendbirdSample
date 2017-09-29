import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Image,
  ListView
} from 'react-native';
import SendBird from 'sendbird';
var PULLDOWN_DISTANCE = 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5
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
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#60768b',
  },
  memberLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#abb8c4',
  }
});

var sb = null;

export default class Channels extends React.Component {

  constructor(props){
    super(props);
    sb = SendBird.getInstance();
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      channelList: [],
      dataSource: ds.cloneWithRows([]),
      listQuery: sb.GroupChannel.createMyGroupChannelListQuery()
    };

    this.getChannelList = this.getChannelList.bind(this);
    this.onChannelPress = this.onChannelPress.bind(this);
    this.onCreatePress = this.onCreatePress.bind(this);
  }

  componentWillMount() {
    this.getChannelList();
  }

  getChannelList() {
    console.log('getting channel list');
    var _SELF = this;
    this.state.listQuery.includeEmpty = true;
    if(this.state.listQuery.hasNext){
      this.state.listQuery.next(function(response, error) {
        if (error) {
          if (response.length == 0) {
            console.log('no response');
            return;
          }
          console.log('Get Channel List Fail.', error);
          return;
        }
        // console.log('channels: ', response);
        response = _SELF.getBuddyName(response);

        _SELF.setState({channelList: _SELF.state.channelList.concat(response)}, () => {
          _SELF.setState({
            dataSource: _SELF.state.dataSource.cloneWithRows(_SELF.state.channelList)
          });
        });
      });
    }

  }

  getBuddyName(response) {
    console.log(sb.getCurrentUserId());
    for( channel in response ) {
      console.log('channel ', response[channel]);
      for( user in response[channel].members ){
        if (response[channel].members[user].userId !== sb.getCurrentUserId()) {
          response[channel].buddy = response[channel].members[user];
          console.log('buddy: ', response[channel].buddy);
        }
      }
    }
    return response;
  }

  channelRefresh() {
    this.state.listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    this.getChannelList();
  }

  onChannelPress(channel) {
    this.props.navigator.push({ name: 'chat', channel: channel });
  }

  onCreatePress() {
    var _SELF = this;
    sb.GroupChannel.createChannelWithUserIds(['GGAdmin'], true, 'testprivate', function(createdChannel, error) {
      if(error){
        console.warn(error);
      }
      console.log('created channel', createdChannel);
      _SELF.channelRefresh();
    });

  }

  render() {
    console.log('rendering');
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.onCreatePress}
            >
            <Text style={styles.label}>Create Chat</Text>
          </TouchableHighlight>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <TouchableHighlight onPress={() => this.onChannelPress(rowData)}>
                <View style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <Image style={styles.channelIcon} source={{uri: rowData.coverUrl}} />
                  </View>
                  <View style={styles.listInfo}>
                    <Text style={styles.titleLabel}>Chat with {rowData.buddy.userId}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            }
            onEndReached={() => this.getChannelList(this.state.next)}
            onEndReachedThreshold={PULLDOWN_DISTANCE}
          />
        </View>
      </View>
    )
  }
}
