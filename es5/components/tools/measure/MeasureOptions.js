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

/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button } from 'antd';
import DistanceMeasurement from '../../../core/measurements/2d/DistanceMeasurement';
import AreaMeasurement from '../../../core/measurements/2d/AreaMeasurement';
import AngleMeasurement from '../../../core/measurements/2d/AngleMeasurement';
var RadioButton = Radio.Button;
var ButtonGroup = Radio.Group;
var DRAW_TOOLS = [{
  key: 'distance',
  icon: 'rocket',
  label: '长度'
}, {
  key: 'area',
  icon: 'usb',
  label: '面积'
} // { key: 'angle', icon: 'man', label: '角度' }
];
var DEFAULT_TOOL = 'distance';

var MeasureOptionsBar = /*#__PURE__*/function (_Component) {
  _inherits(MeasureOptionsBar, _Component);

  var _super = _createSuper(MeasureOptionsBar);

  function MeasureOptionsBar(props) {
    var _this;

    _classCallCheck(this, MeasureOptionsBar);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "toolChangeHandler", function (e) {
      var value = e.target.value;

      _this.setState({
        activeToolKey: value
      });

      _this.startMeasure(value);
    });

    _defineProperty(_assertThisInitialized(_this), "redoHandler", function () {
      _this.startMeasure(_this.state.activeToolKey);
    });

    _this.state = {
      activeToolKey: DEFAULT_TOOL
    };
    _this.measurementTool = null;
    return _this;
  }

  _createClass(MeasureOptionsBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.startMeasure(this.state.activeToolKey);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      console.log('MeasureOptionsBar unmount');
      this.destroyTool();
    }
  }, {
    key: "startMeasure",
    value: function startMeasure(tool) {
      var view = this.props.view;
      var measurementTool;
      this.destroyTool();

      switch (tool) {
        case 'distance':
          measurementTool = new DistanceMeasurement({
            view: view
          });
          break;

        case 'area':
          measurementTool = new AreaMeasurement({
            view: view
          });
          break;

        case 'angle':
          measurementTool = new AngleMeasurement({
            view: view
          });
          break;

        default:
      }

      this.measurementTool = measurementTool;
    }
  }, {
    key: "destroyTool",
    value: function destroyTool() {
      console.log('destroyTool', this.measurementTool);

      if (this.measurementTool) {
        this.measurementTool.destroy();
        this.measurementTool = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, "\u6D4B\u91CF\u7C7B\u578B\uFF1A", /*#__PURE__*/React.createElement(ButtonGroup, {
        defaultValue: DEFAULT_TOOL,
        buttonStyle: "solid",
        onChange: this.toolChangeHandler,
        size: "small"
      }, DRAW_TOOLS.map(function (tool) {
        return /*#__PURE__*/React.createElement(RadioButton, {
          key: tool.key,
          icon: tool.icon,
          value: tool.key
        }, tool.label);
      })), /*#__PURE__*/React.createElement(Button, {
        icon: "redo",
        size: "small",
        type: "primary",
        ghost: true,
        style: {
          marginLeft: '8px'
        },
        onClick: this.redoHandler
      }));
    }
  }]);

  return MeasureOptionsBar;
}(Component);

MeasureOptionsBar.propTypes = {
  view: PropTypes.object.isRequired
};
MeasureOptionsBar.defaultProps = {};
export default MeasureOptionsBar;