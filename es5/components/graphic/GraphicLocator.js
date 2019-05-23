function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import * as geometryUtils from '../../utils/geometry';
import { loadModules } from 'esri-module-loader';
export var extentToGraphic = function extentToGraphic(mapView, graphic, pointZoomValue) {
  if (geometryUtils.type(graphic.geometry) === 'point') {
    mapView.center = graphic.geometry;
    mapView.zoom = pointZoomValue;
  } else {
    mapView.extent = graphic.geometry.extent;
  }
};

var GraphicLocator =
/*#__PURE__*/
function (_Component) {
  _inherits(GraphicLocator, _Component);

  function GraphicLocator() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, GraphicLocator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(GraphicLocator)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "doubleClickHandler", function () {
      if (_this.props.doubleClick) {
        _this.locate();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "clickHandler", function () {
      if (!_this.props.doubleClick) {
        _this.locate();
      }
    });

    return _this;
  }

  _createClass(GraphicLocator, [{
    key: "locate",
    value: function locate() {
      var _this$props = this.props,
          view = _this$props.view,
          graphic = _this$props.graphic,
          geometryJson = _this$props.geometryJson,
          onLocate = _this$props.onLocate,
          pointZoomValue = _this$props.pointZoomValue;

      if (graphic) {
        extentToGraphic(view, graphic, pointZoomValue);
        onLocate();
      } else {
        loadModules(['esri/Graphic', 'esri/geometry/geometryEngine']).then(function (_ref) {
          var Graphic = _ref.Graphic,
              geometryEngine = _ref.geometryEngine;

          if (Array.isArray(geometryJson)) {
            var unionGeometry = geometryEngine.union(geometryJson.map(function (json) {
              return Graphic.fromJSON(json).geometry;
            }));
            view.extent = unionGeometry.extent;
          } else {
            var _graphic = Graphic.fromJSON(geometryJson);

            extentToGraphic(view, _graphic, pointZoomValue);
          }

          onLocate();
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return React.createElement("span", {
        onClick: this.clickHandler,
        onDoubleClick: this.doubleClickHandler
      }, children ? children : React.createElement(Button, {
        size: "small",
        icon: "environment-o"
      }));
    }
  }]);

  return GraphicLocator;
}(Component);

GraphicLocator.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  graphic: PropTypes.object,
  geometryJson: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onLocate: PropTypes.func,
  doubleClick: PropTypes.bool,
  // use doubleClick to trigger locate
  pointZoomValue: PropTypes.number
};
GraphicLocator.defaultProps = {
  doubleClick: false,
  onLocate: function onLocate() {},
  pointZoomValue: 13
};
export default GraphicLocator;