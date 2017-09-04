import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PanResponder,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const getDirectionAndColor = ({ moveX, moveY, dx, dy}) => {
  const draggedDown = dy > 30;
  const draggedUp = dy < -30;
  const draggedLeft = dx < -30;
  const draggedRight = dx > 30;
  const isBlue = moveY > (height - 50) && moveX > 0 && moveX < width;
  let dragDirection = '';

  // if (draggedLeft || draggedRight) {
  //   if (draggedLeft) dragDirection += 'dragged left '
  //   if (draggedRight) dragDirection +=  'dragged right ';
  // }

  // if (isBlue && (draggedLeft || draggedUp)) {
  if (draggedLeft || draggedUp) {
    return true;
  }
  return false;
}


export default class Record extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      finished: false,
      // audioPath: AudioUtils.MainBundlePath,
      audioPath: AudioUtils.CachesDirectoryPath,
      // audioPath: AudioUtils.DocumentDirectoryPath,
      hasPermission: undefined,
      dragged: false
    };

    this.onRecordPressIn = this.onRecordPressIn.bind(this);
    this.onRecordPressOut = this.onRecordPressOut.bind(this);
  }

  prepareRecordingPath(audioPath){
    let audioName = '/audioMsg_'+new Date().getTime()+'.m4a';
    AudioRecorder.prepareRecordingAtPath(audioPath+audioName, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 19200
    });
  }

   componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder:(evt, gestureState) => !!getDirectionAndColor(gestureState),
      onPanResponderMove: (evt, gestureState) => {
        const drag = getDirectionAndColor(gestureState);
        this.setState({
          dragged: drag,
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
    });
  }

  componentDidMount() {
    this.checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });

      if (!hasPermission) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this.finishRecording(data.status === "OK", data.audioFileURL);
        }
      };
    });
  }

  checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'Microphone Permission',
      'message': 'AudioExample needs access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed });
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);

    console.log(this.state.dragged);
    if(!this.state.dragged){
      RNFS.readFile(filePath, 'base64')
          .then((contents) => {

            console.log(contents);
            this.props.onSend({audio: contents}, true);
          });
    }
  }

  async recordStart() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({dragged: false});
    this.setState({recording: true});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }
  
  async recordEnd() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false});

    try {
      const filePath = await AudioRecorder.stopRecording();
      if (Platform.OS === 'android') {
        this.finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  onRecordPressIn() {
    this.recordStart();
    this.props.onChangeOverlay(true);
  }

  onRecordPressOut() {
    this.recordEnd();
    this.props.onChangeOverlay(false);  
  }

  render() {
    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
        <TouchableOpacity
          style={[styles.button, this.props.containerStyle]}
          accessibilityTraits="button"
          delayPressOut={1000}
          onLongPress={this.onRecordPressIn}
          onPressOut={this.props.onPressOutRecordButton || this.onRecordPressOut}
        >
          <IconIonicons style={styles.text} name="ios-mic-outline" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 4,
    right: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: '#00b5ca',
  },
  text: {
    color: "#FFFFFF",
    fontSize: 22,
    backgroundColor: 'transparent',
    textAlign: "center",
    ...Platform.select({
      ios: {
        lineHeight: 30,
      },
      android: {
        lineHeight: 22,
      },
    }),
  }, 
});

Record.defaultProps = {
  containerStyle: {},
  textStyle: {},
  onPressOutRecordButton: null,
};

Record.propTypes = {
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
  onPressOutRecordButton: React.PropTypes.func,
};
