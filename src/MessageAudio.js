import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Sound from 'react-native-sound';
import IconIonicons from 'react-native-vector-icons/Ionicons';

export default class MessageAudio extends React.Component {
  //this.props.currentMessage.audio
  
  render() {
    const { width, height } = Dimensions.get('window');

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          style={[styles.audio, this.props.audioStyle]}
          onPress={this.onActionsPress}
        >
          <IconIonicons name="ios-play" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  audio: {
    width: 100,
    height: 30,
    alignItems:'center',
  },
});

MessageAudio.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  audioStyle: {},
  audioProps: {},
};

MessageAudio.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  audioStyle: Image.propTypes.style,
  audioProps: React.PropTypes.object,
};
