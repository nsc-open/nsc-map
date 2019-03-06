function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { loadModules } from 'esri-module-loader';
import { addKey } from './utils';
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
    _this.state = {
      layer: null,
      // need to put layer as state, so once layer is created, render would run again
      selectedKeys: props.selectedKeys || []
    };
    _this.eventHandlers = [];
    _this.clickHandler = _this.clickHandler.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GraphicsLayer, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      loadModules(['esri/layers/GraphicsLayer']).then(function (_ref) {
        var GraphicsLayer = _ref.GraphicsLayer;
        var map = _this2.props.map;
        var layer = new GraphicsLayer();
        map.add(layer);

        _this2.bindEvents();

        _this2.setState({
          layer: layer
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unbindEvents();
      this.props.map.remove(this.state.layer);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          selectedKeys = _this$props.selectedKeys,
          graphicsLayerProperties = _this$props.graphicsLayerProperties;
      var layer = this.state.layer; // update graphicsLayer properties

      if (graphicsLayerProperties !== prevProps.graphicsLayerProperties) {
        layer.set(graphicsLayerProperties);
      } // handle selection


      if (selectedKeys !== prevProps.selectedKeys) {
        this.setState({
          selectedKeys: selectedKeys
        });
        return;
      }
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this$props2 = this.props,
          view = _this$props2.view,
          allowPointerSelection = _this$props2.allowPointerSelection;

      if (allowPointerSelection) {
        this.eventHandlers.push(view.on('click', this.clickHandler));
      }
    }
  }, {
    key: "unbindEvents",
    value: function unbindEvents() {
      this.eventHandlers.forEach(function (h) {
        return h.remove();
      });
    }
  }, {
    key: "getGraphicKeys",
    value: function getGraphicKeys() {
      var graphics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return graphics.map(function (g) {
        return g.attributes.key;
      });
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(e) {
      var _this3 = this;

      var _this$props3 = this.props,
          view = _this$props3.view,
          onSelectionChange = _this$props3.onSelectionChange;
      var layer = this.state.layer;
      var isControlled = onSelectionChange;
      view.hitTest(e).then(function (_ref2) {
        var results = _ref2.results;
        var selectedGraphics = results.filter(function (r) {
          return r.graphic.layer === layer;
        }).map(function (r) {
          return r.graphic;
        });

        var selectedKeys = _this3.getGraphicKeys(selectedGraphics);

        if (!isControlled) {
          _this3.setState({
            selectedKeys: selectedKeys
          });
        } else {
          onSelectionChange(selectedKeys, selectedGraphics);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      console.log('GraphicsLayer render');
      var _this$props$children = this.props.children,
          children = _this$props$children === void 0 ? [] : _this$props$children;
      var _this$state = this.state,
          layer = _this$state.layer,
          selectedKeys = _this$state.selectedKeys;

      if (layer) {
        var childProps = {
          layer: layer // pass graphicsLayer to direct children

        };
        return Children.map(children, function (child) {
          var graphicKey = child.key;
          addKey(child.props, graphicKey);
          childProps.highlight = selectedKeys.includes(graphicKey);
          return React.cloneElement(child, childProps);
        });
      } else {
        return null;
      }
    }
  }]);

  return GraphicsLayer;
}(Component);

GraphicsLayer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  graphicsLayerProperties: PropTypes.object,
  // graphic selection related
  allowPointerSelection: PropTypes.bool,
  selectedKeys: PropTypes.array,
  onSelectionChange: PropTypes.func // (selectedKeys, selectedGraphics) => {}

};
GraphicsLayer.defaultProps = {
  children: [],
  graphicsLayerProperties: null,
  allowPointerSelection: true,
  selectedKeys: [],
  onSelectionChange: null
};
export default GraphicsLayer;