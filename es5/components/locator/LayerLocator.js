function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const extentToLayer = (mapView, layerId) => {
  const layer = mapView.map.findLayerById(layerId);
  layer && (mapView.extent = layer.fullExtent);
};
/**
 * LayerLocator
 * 
 * usage:
 *    <LayerLocator layerId="" mapView={mapView}>
 *      <Button>Click Me to locate the layer</Button>
 *    </LayerLocator>
 */


class LayerLocator extends Component {
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
      mapView,
      layerId,
      onLocate
    } = this.props;
    extentToLayer(mapView, layerId);
    onLocate();
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

LayerLocator.propTypes = {
  mapView: PropTypes.object.isRequired,
  // mapView
  onLocate: PropTypes.func,
  layerId: PropTypes.string.isRequired,
  doubleClick: PropTypes.bool // use doubleClick to trigger locate

};
LayerLocator.defaultProps = {
  mapView: undefined,
  onLocate: () => {},
  doubleClick: false,
  layerId: undefined
};
export default LayerLocator;