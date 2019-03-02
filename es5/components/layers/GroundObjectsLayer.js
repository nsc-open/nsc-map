function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import GroupLayer from './GroupLayer';
import FeatureLayer from './FeatureLayer';
import { GEOMETRY_TYPE } from '../../constants/geometry';
import * as geometryUtils from '../../utils/geometry';
const featureProperties = {
  source: [],
  objectIdField: 'ObjectID',
  fields: [{
    name: 'ObjectID',
    alias: 'ObjectID',
    type: 'string'
  }, {
    name: 'Name',
    alias: 'Name',
    type: 'string'
  }],
  labelingInfo: [{
    symbol: {
      type: "text",
      // autocasts as new TextSymbol()
      color: "red",
      haloColor: "black"
    },
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.Name"
    }
  }] // is a combination of GraphicsLayer and Annotation Layer

  /**
   * <GroundObjectsLayer>
   *  <GroundObject />
   *  <GroundObject />
   * </GroundObjectsLayer>
   * 
   * TODO:
   *   1. mapping from GroundObject.key to graphic instance
   */

};

class GroundObjectsLayer extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "layerLoadHandler", (layerType, layer) => {
      this.featureLayers[layerType] = layer;
      const {
        point: pointFeatureLayer,
        polyline: polylineFeatureLayer,
        polygon: polygonFeatureLayer
      } = this.featureLayers;

      if (pointFeatureLayer && polylineFeatureLayer && polygonFeatureLayer) {
        this.props.onLoad({
          pointFeatureLayer,
          polylineFeatureLayer,
          polygonFeatureLayer
        });
      }
    });

    this.state = {};
    this.featureLayers = {
      point: null,
      polyline: null,
      polygon: null
    };
  }

  render() {
    console.log('GroundObjectsLayer render', this.props);
    const {
      children,
      map,
      view
    } = this.props;

    if (!map) {
      return null;
    }

    const points = [];
    const multipoints = [];
    const polylines = [];
    const polygons = []; // TODO 这里如果 children数量很大上万条数据，怎么可以快一些或者 cache 计算结果

    Children.map(children, child => {
      const {
        geometry
      } = child.props.geometryJson;
      const type = geometryUtils.type(geometry);

      if (type === GEOMETRY_TYPE.POLYGON.key) {
        polygons.push(child);
      } else if (type === GEOMETRY_TYPE.POLYLINE.key) {
        polylines.push(child);
      } else if (type === GEOMETRY_TYPE.POINT.key) {
        points.push(child);
      } else if (type === GEOMETRY_TYPE.MULTIPOINT.key) {
        multipoints.push(child);
      }
    });
    return React.createElement(GroupLayer, {
      map: map,
      view: view
    }, React.createElement(FeatureLayer, {
      key: "polygonFeatureLayer",
      onLoad: layer => this.layerLoadHandler('polygon', layer),
      featureLayerProperties: _objectSpread({}, featureProperties, {
        geometryType: 'polygon',
        renderer: {
          type: "simple",
          // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-fill",
            // autocasts as new SimpleFillSymbol()
            color: [227, 139, 79, 0.8],
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],
              width: 1
            }
          }
        }
      })
    }, polygons), React.createElement(FeatureLayer, {
      key: "polylineFeatureLayer",
      onLoad: layer => this.layerLoadHandler('polyline', layer),
      featureLayerProperties: _objectSpread({}, featureProperties, {
        geometryType: 'polyline',
        renderer: {
          type: "simple",
          // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-line",
            // autocasts as new SimpleLineSymbol()
            color: "red",
            width: "2px",
            style: "short-dot"
          }
        }
      })
    }, polylines), React.createElement(FeatureLayer, {
      key: "pointFeatureLayer",
      onLoad: layer => this.layerLoadHandler('point', layer),
      featureLayerProperties: _objectSpread({}, featureProperties, {
        geometryType: 'point',
        renderer: {
          type: "simple",
          // autocasts as new SimpleRenderer()
          symbol: {
            type: "simple-marker",
            // autocasts as new SimpleMarkerSymbol()
            style: "square",
            color: "blue",
            size: "8px",
            // pixels
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 0],
              width: 3 // points

            }
          }
        }
      })
    }, points));
  }

}

GroundObjectsLayer.propTypes = {
  map: PropTypes.object,
  featureLayerPropperties: PropTypes.array,
  onLoad: PropTypes.func
};
GroundObjectsLayer.defaultProps = {
  map: null,
  featureLayerPropperties: [{
    geometryType: 'polygon',
    fields: [],
    objectIdField: '',
    labelingInfo: [],
    renderer: {}
  }],
  onLoad: () => {}
};
export default GroundObjectsLayer;