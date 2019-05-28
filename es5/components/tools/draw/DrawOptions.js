function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button, Row } from 'antd';
import Sketch from '../../../core/Sketch';
var RadioButton = Radio.Button;
var ButtonGroup = Radio.Group;
var DRAW_TOOLS = [{
  key: 'point',
  icon: '',
  label: '点'
}, {
  key: 'polyline',
  icon: '',
  label: '线'
}, {
  key: 'polygon',
  icon: '',
  label: '多边形'
}];
var DEFAULT_TOOL = 'point';

var DrawOptionsBar =
/*#__PURE__*/
function (_Component) {
  _inherits(DrawOptionsBar, _Component);

  function DrawOptionsBar(props) {
    var _this;

    _classCallCheck(this, DrawOptionsBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DrawOptionsBar).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "confirmHandler", function () {
      _this.sketch.complete();

      _this.createSketch();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "cancelHandler", function () {
      _this.sketch.cancel();

      _this.createSketch();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "toolChangeHandler", function (e) {
      var tool = e.target.value;

      _this.setState({
        activeToolKey: tool
      });

      _this.createSketch(tool);
    });

    _this.state = {
      activeToolKey: DEFAULT_TOOL
    };
    _this.sketch = null;
    return _this;
  }

  _createClass(DrawOptionsBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          view = _this$props.view,
          beforeComplete = _this$props.beforeCompleteSketch;
      this.sketch = new Sketch({
        view: view
      }, {
        beforeComplete: beforeComplete
      });
      this.createSketch();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.sketch.destroy();
      this.sketch = null;
    }
  }, {
    key: "createSketch",
    value: function createSketch(tool) {
      var targetLayer = this.props.targetLayer;
      var activeToolKey = this.state.activeToolKey;
      tool = tool || activeToolKey;
      this.sketch.create(typeof targetLayer === 'function' ? targetLayer(tool) : targetLayer, tool);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", null, "\u7ED8\u5236\u7C7B\u578B\uFF1A", React.createElement(ButtonGroup, {
        defaultValue: DEFAULT_TOOL,
        buttonStyle: "solid",
        onChange: this.toolChangeHandler,
        size: "small"
      }, DRAW_TOOLS.map(function (tool) {
        return React.createElement(RadioButton, {
          key: tool.key,
          icon: tool.icon,
          value: tool.key
        }, tool.label);
      })), React.createElement(Row, {
        type: "flex",
        justify: "end",
        style: {
          marginTop: '8px'
        }
      }, React.createElement(Button, {
        onClick: this.confirmHandler,
        icon: "check",
        type: "primary",
        size: "small",
        ghost: true,
        style: {
          marginRight: '6px'
        }
      }), React.createElement(Button, {
        onClick: this.cancelHandler,
        icon: "close",
        size: "small",
        type: "danger",
        ghost: true
      })));
    }
  }]);

  return DrawOptionsBar;
}(Component);

DrawOptionsBar.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  targetLayer: PropTypes.func.isRequired,
  beforeCompleteSketch: PropTypes.func
};
export default DrawOptionsBar;