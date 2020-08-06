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

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { loadModules } from 'esri-module-loader';
import { addKey } from './utils';
/**
 * usage:
 *  <FeatureLayer featureLayerProperties={}>
 *    <Graphic />
 *    <Graphic />
 *  </FeatureLayer>
 */

var FeatureLayer = /*#__PURE__*/function (_Component) {
  _inherits(FeatureLayer, _Component);

  var _super = _createSuper(FeatureLayer);

  function FeatureLayer(props) {
    var _this;

    _classCallCheck(this, FeatureLayer);

    _this = _super.call(this, props);
    _this.state = {
      layer: null // need to put layer as state, so once layer is created, render would run again

    };
    return _this;
  }

  _createClass(FeatureLayer, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      loadModules(['FeatureLayer']).then(function (_ref) {
        var FeatureLayer = _ref.FeatureLayer;
        var _this2$props = _this2.props,
            featureLayerProperties = _this2$props.featureLayerProperties,
            onLoad = _this2$props.onLoad;
        var layer = new FeatureLayer(featureLayerProperties);

        _this2.addLayer(layer);

        _this2.setState({
          layer: layer
        });

        onLoad(layer);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeLayer(this.state.layer);
    }
  }, {
    key: "addLayer",
    value: function addLayer(layer) {
      var _this$props = this.props,
          map = _this$props.map,
          parentLayer = _this$props.parentLayer;

      if (parentLayer) {
        console.log('FeatureLayer parentLayer.add(layer)');
        parentLayer.add(layer);
      } else {
        console.log('FeatureLayer map.add(layer)');
        map.add(layer);
      }
    }
  }, {
    key: "removeLayer",
    value: function removeLayer(layer) {
      var _this$props2 = this.props,
          map = _this$props2.map,
          parentLayer = _this$props2.parentLayer;

      if (parentLayer) {
        parentLayer.remove(layer);
      } else {
        map.remove(layer);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$children = this.props.children,
          children = _this$props$children === void 0 ? [] : _this$props$children;
      var layer = this.state.layer;

      if (layer) {
        console.log('FeatureLayer render has layer');
        var childProps = {
          layer: layer
        }; // pass graphicsLayer to direct children

        return Children.map(children, function (child) {
          // const graphicKey = child.key
          // addKey(child.props, graphicKey)
          return /*#__PURE__*/React.cloneElement(child, childProps);
        });
      } else {
        console.log('FeatureLayer render null');
        return null;
      }
    }
  }]);

  return FeatureLayer;
}(Component);

FeatureLayer.propTypes = {
  map: PropTypes.object,
  parentLayer: PropTypes.object,
  featureLayerPropperties: PropTypes.object,
  // isRequired
  onLoad: PropTypes.func
};
FeatureLayer.defaultProps = {
  map: undefined,
  parentLayer: undefined,
  featureLayerPropperties: undefined,
  onLoad: function onLoad(layer) {
    console.log('FeatureLayer onLoad');
  }
};
export default FeatureLayer;