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

/**
 * MapWidget 在 MapPortal 和 MapDraggable 之上，提供基础的样式
 * 
 * MapWidget is a portal component, which means the actual mount position has no relationship with where this component is defined
 * So, there are two ways to define:
 * 
 * <Map>
 *  <MapWidget />
 * </Map>
 * 
 * <div>
 *  <Map />
 *  <MapWidget mapId="default" />
 * </div>
 * 
 * 
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapPortal from './MapPortal';
import MapDraggble from './MapDraggable';
var zIndex = 50;
var MAP_PADDING = 15;
var styles = {
  widget: {
    position: 'absolute',
    display: 'inline-block',
    borderRadius: '2px',
    background: '#fafafa',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    padding: '6px 8px'
  }
};

var MapWidget =
/*#__PURE__*/
function (_Component) {
  _inherits(MapWidget, _Component);

  function MapWidget(props) {
    var _this;

    _classCallCheck(this, MapWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MapWidget).call(this, props));
    _this.state = {
      zIndex: ++zIndex
    };
    return _this;
  }

  _createClass(MapWidget, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          map = _this$props.map,
          view = _this$props.view,
          draggable = _this$props.draggable,
          children = _this$props.children,
          defaultPosition = _this$props.defaultPosition;
      var zIndex = this.state.zIndex;

      if (draggable) {
        return React.createElement(MapDraggble, {
          map: map,
          view: view,
          defaultPosition: defaultPosition,
          zIndex: zIndex
        }, children);
      } else {
        var style = _objectSpread({}, styles.widget, {
          zIndex: zIndex
        });

        if (defaultPosition) {
          style.top = defaultPosition.y + 'px';
          style.left = defaultPosition.x + 'px';
        }

        return React.createElement(MapPortal, {
          map: map,
          view: view
        }, React.createElement("span", {
          style: style
        }, children));
      }
    }
  }]);

  return MapWidget;
}(Component);

MapWidget.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  draggable: PropTypes.bool,
  defaultPosition: PropTypes.object // { x, y }

};
MapWidget.defaultProps = {
  draggable: false
};
export default MapWidget;