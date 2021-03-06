import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class Send extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      buttonTop: 100,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(this.props.text.trim().length > 0 && nextProps.text.trim().length > 0){
      this.setState({
        buttonTop: 100,
      });
    }else{
      this.setState({
        buttonTop: 0,
      });
    }

    if (this.props.text.trim().length === 0 && nextProps.text.trim().length > 0 || this.props.text.trim().length > 0 && nextProps.text.trim().length === 0) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle, {top: this.state.buttonTop}]}
        onPress={() => {
          if(this.props.text.trim().length > 0){
            this.props.onSend({text: this.props.text.trim()}, true);
          }
        }}
        accessibilityTraits="button"
      >
        <Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
    zIndex: 99,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: React.PropTypes.string,
  onSend: React.PropTypes.func,
  label: React.PropTypes.string,
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
