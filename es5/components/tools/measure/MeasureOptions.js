function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button } from 'antd';
import { getNamespace } from '../../../utils/InstanceManager';
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
}, {
  key: 'angle',
  icon: 'man',
  label: '角度'
}];

class MeasureOptionsBar extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "clearMeasurement", () => {
      if (this.measurementTool) {
        this.measurementTool.clearMeasurement();
      }
    });

    _defineProperty(this, "newMeasurement", () => {
      if (this.measurementTool) {
        this.measurementTool.newMeasurement();
      }
    });

    _defineProperty(this, "toolChangeHandler", e => {
      this.setState({
        activeToolKey: e.target.value
      });
    });

    this.state = {
      view: null,
      activeToolKey: 'distance'
    };
    this.measurementTool = null;
  }

  componentWillMount() {
    const {
      mapId
    } = this.props;
    const viewInstanceNamespace = getNamespace('view');
    viewInstanceNamespace.get(mapId).then(view => {
      this.setState({
        view
      });
    });
  }

  componentWillUnmount() {
    this.destroyTool();
  }

  componentDidUpdate() {
    const {
      view,
      activeToolKey
    } = this.state;
    this.destroyTool();

    switch (activeToolKey) {
      case 'distance':
        this.measurementTool = new DistanceMeasurement({
          view
        });
        break;

      case 'area':
        this.measurementTool = new AreaMeasurement({
          view
        });
        break;

      case 'angle':
        this.measurementTool = new AngleMeasurement({
          view
        });
        break;

      default:
    }
  }

  destroyTool() {
    if (this.measurementTool) {
      this.measurementTool.destroy();
      this.measurementTool = null;
    }
  }

  render() {
    return React.createElement("div", null, "\u6D4B\u91CF\u7C7B\u578B\uFF1A", React.createElement(ButtonGroup, {
      defaultValue: "distance",
      buttonStyle: "solid",
      onChange: this.toolChangeHandler,
      size: "small"
    }, DRAW_TOOLS.map(tool => React.createElement(RadioButton, {
      key: tool.key,
      icon: tool.icon,
      value: tool.key
    }, tool.label))), React.createElement("div", {
      style: {
        marginTop: '4px'
      }
    }, React.createElement(Button, {
      size: "small",
      icon: "rollback",
      onClick: this.newMeasurement
    }, "\u91CD\u65B0\u6D4B\u91CF"), React.createElement(Button, {
      size: "small",
      icon: "close",
      onClick: this.clearMeasurement,
      style: {
        marginLeft: '8px'
      },
      type: "danger"
    }, "\u6E05\u9664")));
  }

}

MeasureOptionsBar.propTypes = {
  mapId: PropTypes.string
};
MeasureOptionsBar.defaultProps = {
  mapId: 'default'
};
export default MeasureOptionsBar;