import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';
import Record from './Record';

export default class InputToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeOverlay = this.onChangeOverlay.bind(this);
  }

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props}/>;
  }

  onChangeOverlay(e){
    this.props.onChangeOverlay(e);
  }

  renderRecord() {
    if (this.props.renderRecord) {
      return this.props.renderRecord(this.props);
    }
    return <Record {...this.props} onChangeOverlay={this.onChangeOverlay} />;
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return (
      <Composer
        {...this.props}
      />
    );
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
          {this.renderRecord()}
        </View>
        {this.renderAccessory()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
    backgroundColor: '#ffffff',
    paddingTop: 5,
    paddingBottom: 5
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderRecord: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
};

InputToolbar.propTypes = {
  renderAccessory: React.PropTypes.func,
  renderActions: React.PropTypes.func,
  renderSend: React.PropTypes.func,
  renderRecord: React.PropTypes.func,
  renderComposer: React.PropTypes.func,
  onPressActionButton: React.PropTypes.func,
  onChangeOverlay: React.PropTypes.func,
  containerStyle: View.propTypes.style,
  primaryStyle: View.propTypes.style,
  accessoryStyle: View.propTypes.style,
};
