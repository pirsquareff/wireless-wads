/**
 *
 * DeviceNodeList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import mqtt from 'mqtt';

import DeviceNode from 'components/DeviceNode';

const host = 'ws://35.198.193.141:8000/mqtt';

export class DeviceNodeList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    console.log('DeviceNodeList:: componentDidMount');
    const that = this;
    this.client = mqtt.connect(host, {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
    });
    this.client.on('connect', () => {
      console.log('DeviceNodeList#client:: connected');
      that.client.subscribe('wads/project/demo');
    });
    this.client.on('message', (topic, message) => {
      console.log(message.toString());
      that.addMessage({
        key: Date.now(),
        topic,
        payload: JSON.parse(message),
      });
    });
  }

  addMessage(message) {
    const updated = this.state.messages;
    updated.push(message);
    this.setState({ messages: updated });
  }

  render() {
    const deviceNodes = this.state.messages.map((message) =>
      <DeviceNode key={message.key} message={message} />
    );
    return (
      <div id="deviceNodeList">
        <div className="device-nodes">{deviceNodes}</div>
      </div>
    );
  }
}

DeviceNodeList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(DeviceNodeList);
