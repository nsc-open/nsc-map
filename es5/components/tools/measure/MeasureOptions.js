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
const {
  Button: RadioButton
} = Radio;
const ButtonGroup = Radio.Group;
const DRAW_TOOLS = [{
  key: 'distance',
  icon: 'rocket',
  label: '长度'
}, {
  key: 'area',
  icon: 'usb',
  label: '面积'
}];
const DEFAULT_TOOL = 'distance';

class MeasureOptionsBar extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toolChangeHandler", e => {
      const {
        value
      } = e.target;
      this.setState({
        activeToolKey: value
      });
      this.startMeasure(value);
    });

    _defineProperty(this, "redoHandler", () => {
      this.startMeasure(this.state.activeToolKey);
    });

    this.state = {
      activeToolKey: DEFAULT_TOOL
    };
    this.measurementTool = null;
  }

  componentDidMount() {
    this.startMeasure(this.state.activeToolKey);
  }

  componentWillUnmount() {
    this.destroyTool();
  }

  startMeasure(tool) {
    const {
      view
    } = this.props;
    let measurementTool;
    this.destroyTool();

    switch (tool) {
      case 'distance':
        measurementTool = new DistanceMeasurement({
          view
        });
        break;

      case 'area':
        measurementTool = new AreaMeasurement({
          view
        });
        break;

      case 'angle':
        measurementTool = new AngleMeasurement({
          view
        });
        break;

      default:
    }

    this.measurementTool = measurementTool;
  }

  destroyTool() {
    if (this.measurementTool) {
      this.measurementTool.destroy();
      this.measurementTool = null;
    }
  }

  render() {
    return React.createElement("div", null, "\u6D4B\u91CF\u7C7B\u578B\uFF1A", React.createElement(ButtonGroup, {
      defaultValue: DEFAULT_TOOL,
      buttonStyle: "solid",
      onChange: this.toolChangeHandler,
      size: "small"
    }, DRAW_TOOLS.map(tool => React.createElement(RadioButton, {
      key: tool.key,
      icon: tool.icon,
      value: tool.key
    }, tool.label))), React.createElement(Button, {
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

}

MeasureOptionsBar.propTypes = {
  view: PropTypes.object.isRequired
};
MeasureOptionsBar.defaultProps = {};
export default MeasureOptionsBar;