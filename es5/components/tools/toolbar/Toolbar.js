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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapDraggable from '../../base/MapDraggable';
import MapWidget from '../../base/MapWidget';
import { Icon, Tooltip } from 'antd';
/**
 * Because OptionsBar is highly related to active tools, 
 * so can we define Toolbar like this:
 * 
 * <div>
 *  <MapDraggableForToolbar />
 *  <MapDraggableForOptionsBar />
 * </div>
 * 
 * 即：反正都是  portal，不如这这里一起管理。潜在问题是减少了一些自定义的能力，如果外部希望 optionsBar 渲染到其他地方就不行了
 */

var styles = {
  bar: {
    display: 'inline-block',
    margin: '-6px -8px'
  },
  tools: {
    display: 'flex',
    flexDirection: 'column'
  },
  tool: {
    display: 'inline-block',
    margin: '0 2px',
    padding: '2px 6px',
    cursor: 'pointer'
  },
  activeTool: {
    display: 'inline-block',
    margin: '0 2px',
    padding: '2px 6px',
    cursor: 'pointer',
    background: 'lightgrey'
  }
};

var Toolbar =
/*#__PURE__*/
function (_Component) {
  _inherits(Toolbar, _Component);

  function Toolbar(props) {
    var _this;

    _classCallCheck(this, Toolbar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Toolbar).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "clickHandler", function (toolKey) {
      var activeToolKey = _this.state.activeToolKey;
      var active = false;

      if (activeToolKey !== toolKey) {
        active = true;

        _this.setState({
          activeToolKey: toolKey
        });
      } else {
        active = false;

        _this.setState({
          activeToolKey: ''
        });
      }

      _this.props.onChange(toolKey, active);
    });

    _this.state = {
      activeToolKey: ''
    };
    return _this;
  }

  _createClass(Toolbar, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          map = _this$props.map,
          view = _this$props.view,
          _this$props$tools = _this$props.tools,
          tools = _this$props$tools === void 0 ? [] : _this$props$tools,
          defaultPosition = _this$props.defaultPosition,
          direction = _this$props.direction;
      var activeToolKey = this.state.activeToolKey;
      var activeTool = tools.find(function (t) {
        return t.key === activeToolKey;
      });
      return React.createElement("div", null, React.createElement(MapDraggable, {
        map: map,
        view: view,
        defaultPosition: defaultPosition,
        direction: direction
      }, React.createElement("div", {
        style: styles.bar
      }, React.createElement("div", {
        style: styles.tools
      }, tools.map(function (tool, index) {
        return tool.render ? tool.render() : React.createElement("div", {
          key: index,
          style: activeToolKey === tool.key ? styles.activeTool : styles.tool,
          onClick: function onClick() {
            return _this2.clickHandler(tool.key);
          }
        }, React.createElement(Tooltip, {
          title: tool.label,
          placement: "right"
        }, React.createElement(Icon, {
          type: tool.icon
        })));
      })))), activeTool && activeTool.optionsBar ? React.createElement(MapWidget, {
        map: map,
        view: view,
        draggable: true,
        defaultPosition: {
          x: 100,
          y: 15
        }
      }, activeTool.optionsBar) : null);
    }
  }]);

  return Toolbar;
}(Component);

Toolbar.propTypes = {
  direction: PropTypes.string.isRequired,
  tools: PropTypes.array.isRequired,
  // [{ icon, key, label, render, optionsBar }],
  activeToolKey: PropTypes.string,
  defaultPosition: PropTypes.object.isRequired,
  onChange: PropTypes.func
};
Toolbar.defaultProps = {
  direction: 'verticle',
  defaultPosition: {
    x: 15,
    y: 15
  },
  onChange: function onChange(toolKey, active) {}
};
export default Toolbar;