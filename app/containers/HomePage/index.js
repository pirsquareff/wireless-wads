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
import ReactMapGL from 'react-map-gl';

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    mapStyle: 'mapbox://styles/mapbox/dark-v9',
    viewport: {
      latitude: 13.7387456,
      longitude: 100.5341433,
      zoom: 16,
      bearing: 0,
      pitch: 45,
      width: 500,
      height: 500,
    },
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
    this.addBuildingLayer();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

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

  render() {
    const { viewport, mapStyle } = this.state;
    return (
      <ReactMapGL
        {...viewport}
        mapStyle={mapStyle}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        ref={(node) => {
          this.reactMapGL = node;
        }}
      ></ReactMapGL>
    );
  }
}

HomePage.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
