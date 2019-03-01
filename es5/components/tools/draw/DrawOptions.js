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
const {
  Button: RadioButton
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
}];
const DEFAULT_TOOL = 'point';

class DrawOptionsBar extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "confirmHandler", () => {
      this.sketch.complete();
      this.createSketch();
    });

    _defineProperty(this, "cancelHandler", () => {
      this.sketch.cancel();
      this.createSketch();
    });

    _defineProperty(this, "toolChangeHandler", e => {
      const {
        value: tool
      } = e.target;
      this.setState({
        activeToolKey: tool
      });
      this.createSketch(tool);
    });

    this.state = {
      activeToolKey: DEFAULT_TOOL
    };
    this.sketch = null;
  }

  componentDidMount() {
    const {
      view,
      beforeCompleteSketch: beforeComplete
    } = this.props;
    this.sketch = new Sketch({
      view
    }, {
      beforeComplete
    });
    this.createSketch();
  }

  componentWillUnmount() {
    this.sketch.destroy();
    this.sketch = null;
  }

  createSketch(tool) {
    const {
      targetLayer
    } = this.props;
    const {
      activeToolKey
    } = this.state;
    tool = tool || activeToolKey;
    this.sketch.create(typeof targetLayer === 'function' ? targetLayer(tool) : targetLayer, tool);
  }

  render() {
    return React.createElement("div", null, "\u7ED8\u5236\u7C7B\u578B\uFF1A", React.createElement(ButtonGroup, {
      defaultValue: DEFAULT_TOOL,
      buttonStyle: "solid",
      onChange: this.toolChangeHandler,
      size: "small"
    }, DRAW_TOOLS.map(tool => React.createElement(RadioButton, {
      key: tool.key,
      icon: tool.icon,
      value: tool.key
    }, tool.label))), React.createElement(Row, {
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

}

DrawOptionsBar.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  targetLayer: PropTypes.func.isRequired,
  beforeCompleteSketch: PropTypes.func
};
export default DrawOptionsBar;