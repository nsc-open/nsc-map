function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import * as geometryUtils from '../../utils/geometry';
import { loadModules } from 'esri-module-loader';
export const extentToGraphic = (mapView, graphic) => {
  if (geometryUtils(graphic.geometry) === 'point') {
    mapView.center = graphic.geometry;
    mapView.zoom = 13;
  } else {
    mapView.extent = graphic.geometry.extent;
  }
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
      view,
      graphic,
      geometryJson,
      onLocate
    } = this.props;

    if (graphic) {
      extentToGraphic(view, graphic);
      onLocate();
    } else {
      loadModules('esri/Graphic').then(Graphic => {
        const graphic = Graphic.fromJSON(geometryJson);
        extentToGraphic(view, graphic);
        onLocate();
      });
    }
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
  map: PropTypes.object,
  view: PropTypes.object,
  graphic: PropTypes.object,
  geometryJson: PropTypes.object,
  onLocate: PropTypes.func,
  doubleClick: PropTypes.bool // use doubleClick to trigger locate

};
GraphicLocator.defaultProps = {
  doubleClick: false,
  onLocate: () => {}
};