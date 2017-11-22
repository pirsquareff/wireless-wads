/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import PropTypes from 'prop-types';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl';

import StationInfo from 'components/StationInfo';
import StationPin from 'components/StationPin';
import StationObserver from './StationObserver';
import StationDataService from './stationDataService';

import './Homepage.scss';

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      mapStyle: 'mapbox://styles/mapbox/dark-v9',
      viewport: {
        latitude: 13.7367456,
        longitude: 100.5311433,
        zoom: 17,
        bearing: 0,
        pitch: 60,
        width: 500,
        height: 500,
      },
      stations: new Map(),
      popupInfo: null,
    };
    this.stationDataService = new StationDataService();
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
    this.addBuildingLayer();
    this.stationObserver = new StationObserver(this.onStationChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onStationChange = (stations) => this.setState({ stations });

  onViewportChange = (viewport) => this.setState({ viewport });

  resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight,
      },
    });
  };

  addBuildingLayer() {
    const map = this
      .reactMapGL
      .getMap();
    map.on('load', () => {
      // Insert the layer beneath any symbol layer
      const layers = map
        .getStyle()
        .layers
        .reverse();
      const labelLayerIdx = layers.findIndex((layer) => layer.type !== 'symbol');
      const labelLayerId = labelLayerIdx !== -1
        ? layers[labelLayerIdx].id
        : undefined;
      map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: [
          '==', 'extrude', 'true',
        ],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': {
            type: 'identity',
            property: 'height',
          },
          'fill-extrusion-base': {
            type: 'identity',
            property: 'min_height',
          },
          'fill-extrusion-opacity': 0.3,
        },
      }, labelLayerId);
    });
  }

  renderPopup() {
    const { popupInfo } = this.state;

    return popupInfo && (
      <Popup
        tipSize={5}
        anchor="top"
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        onClose={() => this.setState({ popupInfo: null })}
      >
        <StationInfo info={popupInfo} />
      </Popup>
    );
  }

  renderStationMarker() {
    const { stations } = this.state;
    const stationsArray = Array.from(stations.values());
    const stationNodes = stationsArray.map((station) => {
      const stationData = this.stationDataService.getStation(station.fromRaspId);
      return (
        <Marker
          key={`marker-${station.fromRaspId}`}
          longitude={stationData.longitude}
          latitude={stationData.latitude}
        >
          <StationPin size={20} fill={'#d00'} onClick={() => this.setState({ popupInfo: stationData })} />
        </Marker>
      );
    });
    return stationNodes;
  }

  renderDeviceMarker() {
    const { stations } = this.state;
    const stationsArray = Array.from(stations.values());

    const stationNodes = stationsArray.map((station) => {
      const stationData = this.stationDataService.getStation(station.fromRaspId);
      const devicesArray = station.devices;

      const deviceNode = devicesArray.map((device) => {
        const r = device.distance;
        const zeta = parseInt((device.id).replace(/\D/g, ''), 10);
        const longtitudePlus = r * Math.sin(zeta);
        const latitudePlus = r * Math.cos(zeta);
        return (
          <Marker
            key={`devise-${device.id}`}
            longitude={stationData.longitude + (longtitudePlus / 100000)}
            latitude={stationData.latitude + (latitudePlus / 100000)}
          >
            <StationPin size={10} fill={'#fff'} onClick={() => this.onClickStationPin()} />
          </Marker>
        );
      });

      return deviceNode;
    });

    return stationNodes;
  }

  render() {
    const { viewport, mapStyle } = this.state;
    return (
      <div>
        <ReactMapGL
          {...viewport}
          mapStyle={mapStyle}
          onViewportChange={this.onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          ref={(node) => {
            this.reactMapGL = node;
          }}
        >
          <ReactCSSTransitionGroup
            transitionName="station-pin"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {this.renderStationMarker()}
            {this.renderPopup()}
            {this.renderDeviceMarker()}
          </ReactCSSTransitionGroup>

          <div
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
            }}
          >
            <NavigationControl onViewportChange={this.onViewportChange} />
          </div>
        </ReactMapGL>
      </div>
    );
  }
}

HomePage.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};


// 13.736908, 100.533843
// 13.736833, 100.533832
