/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */
import React, { Component } from 'react';
import { Radio } from 'antd';
const {
  Button
} = Radio;
const ButtonGroup = Radio.Group;
const DRAW_TOOLS = [{
  key: 'point',
  icon: 'rocket',
  label: '点'
}, {
  key: 'polyline',
  icon: 'usb',
  label: '线'
}, {
  key: 'polygon',
  icon: 'man',
  label: '多边形'
}, {
  key: 'circle',
  icon: 'woman',
  label: '圆'
}];

class DrawOptionsBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeToolKey: 'point'
    };
  }

  toolChangeHandler(e) {
    console.log(e);
  }

  render() {
    return React.createElement("div", null, "\u7ED8\u5236\u7C7B\u578B\uFF1A", React.createElement(ButtonGroup, {
      defaultValue: "point",
      buttonStyle: "solid",
      onChange: this.toolChangeHandler,
      size: "small"
    }, DRAW_TOOLS.map(tool => React.createElement(Button, {
      key: tool.key,
      icon: tool.icon,
      value: tool.key
    }, tool.label))));
  }

}

export default DrawOptionsBar;