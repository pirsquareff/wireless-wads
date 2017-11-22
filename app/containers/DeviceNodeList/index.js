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
import { Marker } from 'react-map-gl';

import StationPin from 'components/StationPin';
import StationDataService from './stationDataService';

const mqttHost = 'ws://35.198.193.141:8000/mqtt';
const mqttTopic = 'wads/project/demo';

export class DeviceNodeList extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.stationDataService = new StationDataService();
    this.state = {
      stations: new Map(),
    };
  }

  componentDidMount() {
    // console.log('DeviceNodeList:: componentDidMount');
    const that = this;
    this.client = mqtt.connect(mqttHost, {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
    });
    this.client.on('connect', () => {
      // console.log('DeviceNodeList#client:: connected');
      that.client.subscribe(mqttTopic);
    });
    this.client.on('message', (topic, message) => {
      if (topic === mqttTopic) {
        // console.log(message.toString());
        const jsonMessage = JSON.parse(message);
        that.updateStation({
          data: jsonMessage,
        });
      }
    });
  }

  onClickStationPin() {
    // console.log('onClickStationPin');
  }

  updateStation(station) {
    const updatedStations = this.state.stations;
    updatedStations.set(station.data.fromRaspId, station.data);
    this.setState({ stations: updatedStations });
  }

  render() {
    const stations = Array.from(this.state.stations.values());
    const stationNodes = stations.map((station) => {
      const stationData = this.stationDataService.getStation(station.fromRaspId);
      return (
        <Marker
          key={`marker-${station.fromRaspId}`}
          longitude={stationData.longitude}
          latitude={stationData.latitude}
        >
          <StationPin size={20} onClick={() => this.onClickStationPin()} />
        </Marker>
      );
    });
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {stationNodes}
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
