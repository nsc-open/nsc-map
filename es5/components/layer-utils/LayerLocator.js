function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

var extentToLayer = function extentToLayer(mapView, layerId) {
  var layer = mapView.map.findLayerById(layerId);
  layer && (mapView.extent = layer.fullExtent);
};
/**
 * LayerLocator
 * 
 * usage:
 *    <LayerLocator layerId="" map view>
 *      <Button>Click Me to locate the layer</Button>
 *    </LayerLocator>
 */


var LayerLocator = /*#__PURE__*/function (_Component) {
  _inherits(LayerLocator, _Component);

  var _super = _createSuper(LayerLocator);

  function LayerLocator() {
    var _this;

    _classCallCheck(this, LayerLocator);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

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

  _createClass(LayerLocator, [{
    key: "locate",
    value: function locate() {
      var _this$props = this.props,
          view = _this$props.view,
          layerId = _this$props.layerId,
          onLocate = _this$props.onLocate;
      extentToLayer(view, layerId);
      onLocate();
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return /*#__PURE__*/React.createElement("span", {
        onClick: this.clickHandler,
        onDoubleClick: this.doubleClickHandler
      }, children ? children : /*#__PURE__*/React.createElement(Button, {
        size: "small",
        icon: "environment-o"
      }));
    }
  }]);

  return LayerLocator;
}(Component);

LayerLocator.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  onLocate: PropTypes.func,
  layerId: PropTypes.string.isRequired,
  doubleClick: PropTypes.bool // use doubleClick to trigger locate

};
LayerLocator.defaultProps = {
  map: undefined,
  view: undefined,
  onLocate: function onLocate() {},
  doubleClick: false,
  layerId: undefined
};
export default LayerLocator;