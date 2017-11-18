/**
*
* DeviceNode
*
*/

import React from 'react';
import PropTypes from 'prop-types';

class DeviceNode extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="device-node">
        {this.props.message.payload.id}
      </div>
    );
  }
}

DeviceNode.propTypes = {
  message: PropTypes.object,
};

export default DeviceNode;
