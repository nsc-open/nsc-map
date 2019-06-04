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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "graphicSelectHandler", function (e, _ref) {
      var key = _ref.key,
          selected = _ref.selected,
          graphic = _ref.graphic;
      console.log('select graphic', key, graphic, e);
      var selectedKeys = _this.state.selectedKeys;

      if (selected) {
        !selectedKeys.includes(key) && _this.setState({
          selectedKeys: [].concat(_toConsumableArray(selectedKeys), [key])
        });
      } else {
        _this.setState({
          selectedKeys: selectedKeys.filter(function (k) {
            return k !== key;
          })
        });
      }
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

      loadModules(['esri/layers/GraphicsLayer']).then(function (_ref2) {
        var GraphicsLayer = _ref2.GraphicsLayer;
        var _this2$props = _this2.props,
            map = _this2$props.map,
            onLoad = _this2$props.onLoad;
        var layer = new GraphicsLayer();
        map.add(layer);

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
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var properties = this.props.properties;
      var layer = this.state.layer; // update graphicsLayer properties

      if (properties !== prevProps.properties) {// layer.set(properties)
        // TODO
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      console.log('GraphicsLayer render', this);
      var _this$props = this.props,
          view = _this$props.view,
          _this$props$children = _this$props.children,
          children = _this$props$children === void 0 ? [] : _this$props$children;
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
            selected: selectedKeys.includes(graphicKey),
            editing: editingKeys.includes(graphicKey),
            selectable: true,
            editable: true,
            onSelect: _this3.graphicSelectHandler
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
        if (needSync('selectedKeys')) {//newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props);
        } else if (!prevProps && props.defaultSelectedKeys) {//newState.selectedKeys = calcSelectedKeys(props.defaultSelectedKeys, props);
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
  hoverable: true,
  onLoad: function onLoad(layer) {},
  onSelect: function onSelect() {},
  onHover: function onHover() {}
};
export default GraphicsLayer;