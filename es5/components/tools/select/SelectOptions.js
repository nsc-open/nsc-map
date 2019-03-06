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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Checkbox } from 'antd';
import GraphicSelectionManager from '../../../core/graphic-selection-manager/GraphicSelectionManager';
var RadioButton = Radio.Button;
var ButtonGroup = Radio.Group;
var SELECT_TOOLS = [{
  key: 'pointer',
  icon: '',
  label: '点选'
}, {
  key: 'box',
  icon: '',
  label: '框选'
}];
var DEFAULT_TOOL = 'pointer';

var SelectOptions =
/*#__PURE__*/
function (_Component) {
  _inherits(SelectOptions, _Component);

  function SelectOptions(props) {
    var _this;

    _classCallCheck(this, SelectOptions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SelectOptions).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "toolChangeHandler", function (e) {
      _this.setState({
        activeToolKey: e.target.value
      }, function () {
        return _this.activateSelect();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "multiSelectChangeHandler", function (e) {
      _this.setState({
        enableMultiSelection: e.target.checked
      }, function () {
        return _this.activateSelect();
      });
    });

    _this.state = {
      activeToolKey: DEFAULT_TOOL,
      enableMultiSelection: false
    };
    _this.graphicSelectionManager = null;
    return _this;
  }

  _createClass(SelectOptions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          view = _this$props.view,
          sourceLayers = _this$props.sourceLayers;
      this.graphicSelectionManager = new GraphicSelectionManager({
        view: view,
        layers: sourceLayers
      });
      this.activateSelect();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.graphicSelectionManager.destroy();
      this.graphicSelectionManager = null;
    }
  }, {
    key: "activateSelect",
    value: function activateSelect() {
      var _this$state = this.state,
          activeToolKey = _this$state.activeToolKey,
          enableMultiSelection = _this$state.enableMultiSelection;
      this.graphicSelectionManager.activate({
        type: activeToolKey,
        multiSelect: enableMultiSelection
      });
    }
  }, {
    key: "render",
    value: function render() {
      var enableMultiSelection = this.state.enableMultiSelection;
      return React.createElement("div", null, "\u9009\u62E9\u65B9\u5F0F\uFF1A", React.createElement(ButtonGroup, {
        defaultValue: DEFAULT_TOOL,
        buttonStyle: "solid",
        onChange: this.toolChangeHandler,
        size: "small"
      }, SELECT_TOOLS.map(function (tool) {
        return React.createElement(RadioButton, {
          key: tool.key,
          icon: tool.icon,
          value: tool.key,
          disabled: tool.key === 'box'
        }, tool.label);
      })), React.createElement(Checkbox, {
        disabled: true,
        checked: enableMultiSelection,
        onChange: this.multiSelectChangeHandler,
        style: {
          marginLeft: '16px'
        }
      }, "\u591A\u9009"));
    }
  }]);

  return SelectOptions;
}(Component);

SelectOptions.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  sourceLayers: PropTypes.array.isRequired
};
SelectOptions.defaultProps = {
  sourceLayers: []
};
export default SelectOptions;