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

/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */
import React, { Component } from 'react';
import { Radio, DatePicker, Row, Col } from 'antd';
var Button = Radio.Button;
var ButtonGroup = Radio.Group;
var RangePicker = DatePicker.RangePicker;
var EXPORT_TYPES = [{
  key: 'select',
  icon: 'rocket',
  label: '框选导出'
}, {
  key: 'time',
  icon: 'man',
  label: '时间范围导出'
}, {
  key: 'all',
  icon: 'usb',
  label: '全部导出'
}];

var ExportOptionsBar =
/*#__PURE__*/
function (_Component) {
  _inherits(ExportOptionsBar, _Component);

  function ExportOptionsBar(props) {
    var _this;

    _classCallCheck(this, ExportOptionsBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExportOptionsBar).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "toolChangeHandler", function (e) {
      console.log(e);

      _this.setState({
        activeToolKey: e.target.value
      });
    });

    _this.state = {
      activeToolKey: 'select'
    };
    return _this;
  }

  _createClass(ExportOptionsBar, [{
    key: "render",
    value: function render() {
      var activeToolKey = this.state.activeToolKey;
      return React.createElement("div", null, "\u5BFC\u51FA\u65B9\u5F0F\uFF1A", React.createElement(ButtonGroup, {
        defaultValue: "select",
        buttonStyle: "solid",
        onChange: this.toolChangeHandler,
        size: "small"
      }, EXPORT_TYPES.map(function (tool) {
        return React.createElement(Button, {
          key: tool.key,
          icon: tool.icon,
          value: tool.key
        }, tool.label);
      })), activeToolKey === 'time' ? React.createElement("div", {
        style: {
          marginTop: '8px'
        }
      }, React.createElement(RangePicker, {
        size: "small"
      })) : null);
    }
  }]);

  return ExportOptionsBar;
}(Component);

export default ExportOptionsBar;