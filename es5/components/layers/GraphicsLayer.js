function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
import { loadModules } from 'esri-module-loader';
import Graphic from '../graphic/Graphic';

var createLayer = function createLayer(properties) {
  return loadModules(['esri/layers/GraphicsLayer']).then(function (_ref) {
    var GraphicsLayer = _ref.GraphicsLayer;
    return new GraphicsLayer(properties);
  });
};
/**
 * usage:
 *  <GraphicsLayer selectedKeys={[]}>
      <Graphic key="" highlight highlightSymbol={} geometryJson={} />
      <Graphic key="" graphicProperties={} />
    </GraphicsLayer>
 */


var GraphicsLayer =
/*#__PURE__*/
function (_Component) {
  _inherits(GraphicsLayer, _Component);

  function GraphicsLayer(props) {
    var _this;

    _classCallCheck(this, GraphicsLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GraphicsLayer).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setUncontrolledState", function (state) {
      var needSync = false;
      var newState = {};
      Object.keys(state).forEach(function (name) {
        if (name in _this.props) {
          return;
        }

        needSync = true;
        newState[name] = state[name];
      });
      console.log('needsync', needSync);

      if (needSync) {
        _this.setState(newState);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "graphicSelectHandler", function (e, _ref2) {
      var key = _ref2.key,
          selected = _ref2.selected,
          graphic = _ref2.graphic;
      var onSelect = _this.props.onSelect;
      var selectedKeys = _this.state.selectedKeys;
      var newSelectedKeys = [];

      if (selected && !selectedKeys.includes(key)) {
        newSelectedKeys = [].concat(_toConsumableArray(selectedKeys), [key]);
      } else if (!selected) {
        newSelectedKeys = selectedKeys.filter(function (k) {
          return k !== key;
        });
      }

      _this.setUncontrolledState({
        selectedKeys: newSelectedKeys
      });

      onSelect && onSelect(newSelectedKeys, {
        event: e,
        key: key,
        selected: selected,
        graphic: graphic
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "graphicEditHandler", function (_ref3) {
      var graphic = _ref3.graphic,
          e = _ref3.e,
          key = _ref3.key;
      console.log('key edit', key, graphic, e);

      _this.props.onEdit({
        graphic: graphic,
        e: e,
        key: key
      });
    });

    _this.state = {
      layer: null,
      selectedKeys: [],
      editingKeys: []
    };
    return _this;
  }

  _createClass(GraphicsLayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          properties = _this$props.properties,
          map = _this$props.map,
          onLoad = _this$props.onLoad;
      createLayer(properties).then(function (layer) {
        _this2.setState({
          layer: layer
        });

        map.add(layer);
        onLoad(layer);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.map.remove(this.state.layer);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      // only when layer is created, this component should be updated
      // or, this to ensure state.layer always has value in componentDidUpdate
      if (!nextState.layer) {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;

      var properties = this.props.properties;
      var layer = this.state.layer;

      var needSync = function needSync(name) {
        return !prevProps && name in _this3.props || prevProps && prevProps[name] !== _this3.props[name];
      }; // update graphicsLayer properties


      if (needSync('properties')) {
        layer.set(properties);
      }
    }
    /**
     * Only update the value which is not in props
     */

  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props2 = this.props,
          view = _this$props2.view,
          _this$props2$children = _this$props2.children,
          children = _this$props2$children === void 0 ? [] : _this$props2$children;
      var _this$state = this.state,
          layer = _this$state.layer,
          editingKeys = _this$state.editingKeys,
          selectedKeys = _this$state.selectedKeys;

      if (layer) {
        return Children.map(children, function (child) {
          var graphicKey = Graphic.getKey(child.props);
          return React.cloneElement(child, {
            view: view,
            layer: layer,
            selectable: true,
            selected: selectedKeys.includes(graphicKey),
            onSelect: _this4.graphicSelectHandler,
            editable: true,
            editing: editingKeys.includes(graphicKey),
            onEdit: _this4.graphicEditHandler
          });
        });
      } else {
        return null;
      }
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      var prevProps = prevState.prevProps;
      var newState = {
        prevProps: props
      };

      var needSync = function needSync(name) {
        return !prevProps && name in props || prevProps && prevProps[name] !== props[name];
      }; // ================ selectedKeys =================


      if (props.selectable) {
        if (needSync('selectedKeys')) {
          newState.selectedKeys = props.selectedKeys;
        }
      } // ================ editingKeys =================


      if (props.editable) {
        if (needSync('editingKeys')) {
          newState.editingKeys = props.editingKeys;
        }
      }

      return newState;
    }
  }]);

  return GraphicsLayer;
}(Component);

GraphicsLayer.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  properties: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  selectable: PropTypes.bool.isRequired,
  hoverable: PropTypes.bool.isRequired,
  selectedKeys: PropTypes.array,
  editingKeys: PropTypes.array,
  // hoverKeys: PropTypes.array // hover 是不需要 keys 去控制的，hover 一定是鼠标 hover 事件触发，不应该由外部去控制
  sketch: PropTypes.func,
  onLoad: PropTypes.func,
  onSelect: PropTypes.func,
  onHover: PropTypes.func
};
GraphicsLayer.defaultProps = {
  children: [],
  properties: null,
  selectable: true,
  editable: true,
  hoverable: true,
  onLoad: function onLoad(layer) {},
  onSelect: function onSelect() {},
  onHover: function onHover() {}
};
export default GraphicsLayer;