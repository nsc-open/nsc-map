function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */
import React, { Component } from 'react';
import { Radio, DatePicker, Row, Col } from 'antd';
const {
  Button
} = Radio;
const ButtonGroup = Radio.Group;
const {
  RangePicker
} = DatePicker;
const EXPORT_TYPES = [{
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

class ExportOptionsBar extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toolChangeHandler", e => {
      console.log(e);
      this.setState({
        activeToolKey: e.target.value
      });
    });

    this.state = {
      activeToolKey: 'select'
    };
  }

  render() {
    const {
      activeToolKey
    } = this.state;
    return React.createElement("div", null, "\u5BFC\u51FA\u65B9\u5F0F\uFF1A", React.createElement(ButtonGroup, {
      defaultValue: "select",
      buttonStyle: "solid",
      onChange: this.toolChangeHandler,
      size: "small"
    }, EXPORT_TYPES.map(tool => React.createElement(Button, {
      key: tool.key,
      icon: tool.icon,
      value: tool.key
    }, tool.label))), activeToolKey === 'time' ? React.createElement("div", {
      style: {
        marginTop: '8px'
      }
    }, React.createElement(RangePicker, {
      size: "small"
    })) : null);
  }

}

export default ExportOptionsBar;