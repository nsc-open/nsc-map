function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { loadModules } from 'esri-module-loader';

var GroupLayer =
/*#__PURE__*/
function (_Component) {
  _inherits(GroupLayer, _Component);

  function GroupLayer(props) {
    var _this;

    _classCallCheck(this, GroupLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupLayer).call(this, props));
    _this.state = {
      layer: null
    };
    return _this;
  }

  _createClass(GroupLayer, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      console.log('GroupLayer willmount');
      loadModules(['esri/layers/GroupLayer']).then(function (_ref) {
        var GroupLayer = _ref.GroupLayer;
        var _this2$props = _this2.props,
            map = _this2$props.map,
            index = _this2$props.index,
            onLoad = _this2$props.onLoad;
        console.log(onLoad);
        var layer = new GroupLayer();
        map.add(layer, index);
        console.log('GroupLayer map.add(layer)');

        _this2.setState({
          layer: layer
        });

        onLoad(layer);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.map.remove(this.state.layer);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          map = _this$props.map,
          view = _this$props.view;
      var layer = this.state.layer;

      if (layer && children) {
        console.log('GroupLayer render');
        return Children.map(children, function (child) {
          var childProps = _objectSpread({}, child.props, {
            map: map,
            view: view,
            parentLayer: layer
          });

          return React.cloneElement(child, childProps);
        });
      } else {
        console.log('GroupLayer render null', this.props);
        return null;
      }
    }
  }]);

  return GroupLayer;
}(Component);

GroupLayer.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  index: PropTypes.number,
  onLoad: PropTypes.func
};
GroupLayer.defaultProps = {
  map: undefined,
  view: undefined,
  onLoad: function onLoad(layer) {
    console.log('GroupLayer onLoad');
  }
};
export default GroupLayer;