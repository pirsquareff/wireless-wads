/**
*
* DeviceNode
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { subscribe } from 'mqtt-react';

class DeviceNode extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ul>
        { this.props.data.map((message) => <li>{message}</li>) }
      </ul>
    );
  }
}

DeviceNode.propTypes = {
  data: PropTypes.array,
};

export default subscribe({
  topic: 'wads/project/demo',
})(DeviceNode);
