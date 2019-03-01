function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio, Checkbox } from 'antd';
import GraphicSelectionManager from '../../../core/graphic-selection-manager/GraphicSelectionManager';
const {
  Button: RadioButton
} = Radio;
const ButtonGroup = Radio.Group;
const SELECT_TOOLS = [{
  key: 'pointer',
  icon: '',
  label: '点选'
}, {
  key: 'box',
  icon: '',
  label: '框选'
}];
const DEFAULT_TOOL = 'pointer';

class SelectOptions extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toolChangeHandler", e => {
      this.setState({
        activeToolKey: e.target.value
      }, () => this.activateSelect());
    });

    _defineProperty(this, "multiSelectChangeHandler", e => {
      this.setState({
        enableMultiSelection: e.target.checked
      }, () => this.activateSelect());
    });

    this.state = {
      activeToolKey: DEFAULT_TOOL,
      enableMultiSelection: false
    };
    this.graphicSelectionManager = null;
  }

  componentDidMount() {
    const {
      view,
      sourceLayers
    } = this.props;
    this.graphicSelectionManager = new GraphicSelectionManager({
      view,
      layers: sourceLayers
    });
    this.activateSelect();
  }

  componentWillUnmount() {
    this.graphicSelectionManager.destroy();
    this.graphicSelectionManager = null;
  }

  activateSelect() {
    const {
      activeToolKey,
      enableMultiSelection
    } = this.state;
    this.graphicSelectionManager.activate({
      type: activeToolKey,
      multiSelect: enableMultiSelection
    });
  }

  render() {
    const {
      enableMultiSelection
    } = this.state;
    return React.createElement("div", null, "\u9009\u62E9\u65B9\u5F0F\uFF1A", React.createElement(ButtonGroup, {
      defaultValue: DEFAULT_TOOL,
      buttonStyle: "solid",
      onChange: this.toolChangeHandler,
      size: "small"
    }, SELECT_TOOLS.map(tool => React.createElement(RadioButton, {
      key: tool.key,
      icon: tool.icon,
      value: tool.key,
      disabled: tool.key === 'box'
    }, tool.label))), React.createElement(Checkbox, {
      disabled: true,
      checked: enableMultiSelection,
      onChange: this.multiSelectChangeHandler,
      style: {
        marginLeft: '16px'
      }
    }, "\u591A\u9009"));
  }

}

SelectOptions.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  sourceLayers: PropTypes.array.isRequired
};
SelectOptions.defaultProps = {
  sourceLayers: []
};
export default SelectOptions;