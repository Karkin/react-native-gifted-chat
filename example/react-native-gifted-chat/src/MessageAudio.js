import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import IconIonicons from 'react-native-vector-icons/Ionicons';

var whoosh;

export default class MessageAudio extends React.Component {
   constructor(props) {
    super(props);
    this.onActionsPress = this.onActionsPress.bind(this);
  }

  onActionsPress() {
    // console.log(this.props.currentMessage.audio);
    setTimeout(() => {
      var path = RNFS.CachesDirectoryPath+'/audioMsg_'+new Date().getTime()+'.aac';
      RNFS.writeFile(path, this.props.currentMessage.audio, 'base64')
          .then((success) => {
              if(whoosh){
                whoosh.stop();
              }
              whoosh = new Sound(path, "", (error) => {
              if (error) {
                console.log('failed to load the sound', error);
                return;
              } 
              // loaded successfully
              console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
              setTimeout(() => {
                // Play the sound with an onEnd callback
                whoosh.play((success) => {
                  if (success) {
                    console.log('successfully finished playing');
                  } else {
                    console.log('playback failed due to audio decoding errors');
                  }
                });
              }, 100);
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
    }, 100);
  }
  
  render() {
    const { width, height } = Dimensions.get('window');

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          style={[styles.audio, this.props.audioStyle]}
          onPress={this.onActionsPress}
        >
          <IconIonicons name="ios-play" size={30} color="#000000" />
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
