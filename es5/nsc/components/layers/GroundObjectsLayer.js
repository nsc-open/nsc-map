function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import GroupLayer from '../../../esri/components/layers/GroupLayer';
import FeatureLayer from '../../../esri/components/layers/FeatureLayer';
import { GEOMETRY_TYPE } from '../../../constants/geometry';
import * as geometryUtils from '../../../utils/geometry';
var defaultFeatureLayerProperties = {
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
      color: "green",
      haloColor: "black",
      font: {
        size: 12
      }
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

var GroundObjectsLayer =
/*#__PURE__*/
function (_Component) {
  _inherits(GroundObjectsLayer, _Component);

  function GroundObjectsLayer(props) {
    var _this;

    _classCallCheck(this, GroundObjectsLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroundObjectsLayer).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "layerLoadHandler", function (layerType, layer) {
      _this.featureLayers[layerType] = layer;
      var _this$featureLayers = _this.featureLayers,
          pointFeatureLayer = _this$featureLayers.point,
          polylineFeatureLayer = _this$featureLayers.polyline,
          polygonFeatureLayer = _this$featureLayers.polygon;

      if (pointFeatureLayer && polylineFeatureLayer && polygonFeatureLayer) {
        _this.props.onLoad({
          pointFeatureLayer: pointFeatureLayer,
          polylineFeatureLayer: polylineFeatureLayer,
          polygonFeatureLayer: polygonFeatureLayer
        });
      }
    });

    _this.state = {};
    _this.featureLayers = {
      point: null,
      polyline: null,
      polygon: null
    };
    return _this;
  }

  _createClass(GroundObjectsLayer, [{
    key: "getFeatureLayerProperties",
    value: function getFeatureLayerProperties(geometryType) {
      var featureLayerProperties = this.props.featureLayerProperties;
      var match = featureLayerProperties.find(function (p) {
        return p.geometryType === geometryType;
      }) || {};
      return _objectSpread({}, defaultFeatureLayerProperties, match);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      console.log('GroundObjectsLayer render', this.props);
      var _this$props = this.props,
          children = _this$props.children,
          map = _this$props.map,
          view = _this$props.view;

      if (!map) {
        return null;
      }

      var points = [];
      var multipoints = [];
      var polylines = [];
      var polygons = []; // TODO 这里如果 children数量很大上万条数据，怎么可以快一些或者 cache 计算结果

      Children.map(children, function (child) {
        var geometry = child.props.geometryJson.geometry;
        var type = geometryUtils.type(geometry);

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
        onLoad: function onLoad(layer) {
          return _this2.layerLoadHandler('polygon', layer);
        },
        featureLayerProperties: this.getFeatureLayerProperties('polygon')
      }, polygons), React.createElement(FeatureLayer, {
        key: "polylineFeatureLayer",
        onLoad: function onLoad(layer) {
          return _this2.layerLoadHandler('polyline', layer);
        },
        featureLayerProperties: this.getFeatureLayerProperties('polyline')
      }, polylines), React.createElement(FeatureLayer, {
        key: "pointFeatureLayer",
        onLoad: function onLoad(layer) {
          return _this2.layerLoadHandler('point', layer);
        },
        featureLayerProperties: this.getFeatureLayerProperties('point')
      }, points));
    }
  }]);

  return GroundObjectsLayer;
}(Component);

GroundObjectsLayer.propTypes = {
  map: PropTypes.object,
  featureLayerProperties: PropTypes.array,
  onLoad: PropTypes.func
};
GroundObjectsLayer.defaultProps = {
  map: null,
  featureLayerProperties: [{
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
  }, {
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
  }, {
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
  }],
  onLoad: function onLoad() {}
};
export default GroundObjectsLayer;