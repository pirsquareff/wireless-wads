/**
*
* StationInfo
*
*/

import React from 'react';
import PropTypes from 'prop-types';

class StationInfo extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { info } = this.props;
    const displayName = `${info.name}`;

    return (
      <div class="popup">
        {displayName}&nbsp;&nbsp;&nbsp;
      </div>
    );
  }
}

StationInfo.propTypes = {
  info: PropTypes.object,
};

export default StationInfo;
