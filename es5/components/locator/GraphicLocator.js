function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import MapInstanceManager from '@/lib/map/managers/InstanceManager';
import { loadModules } from 'esri-module-loader';
export const extentToGraphic = (map, graphic) => {
  return loadModules([{
    name: 'graphicsUtils',
    path: 'esri/graphicsUtils'
  }]).then(({
    graphicsUtils
  }) => {
    if (graphic.geometry.type === 'point') {
      mapView.center = graphic.geometry;
      mapView.zoom = 13;
    } else {// const extent = graphicsUtils.graphicsExtent([graphic])
      // mapView.extent = extent
    }
  });
};

class GraphicLocator extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "doubleClickHandler", () => {
      if (this.props.doubleClick) {
        this.locate();
      }
    });

    _defineProperty(this, "clickHandler", () => {
      if (!this.props.doubleClick) {
        this.locate();
      }
    });
  }

  locate() {
    const {
      mapId,
      graphic,
      onLocate
    } = this.props;
    MapInstanceManager.get(mapId).then(map => extentToGraphic(map, graphic)).then(() => onLocate);
  }

  render() {
    const {
      children
    } = this.props;
    return React.createElement("span", {
      onClick: this.clickHandler,
      onDoubleClick: this.doubleClickHandler
    }, children ? children : React.createElement(Button, {
      size: "small",
      icon: "environment-o"
    }));
  }

}

GraphicLocator.propTypes = {
  doubleClick: PropTypes.bool // use doubleClick to trigger locate

};
GraphicLocator.defaultProps = {
  doubleClick: false
};