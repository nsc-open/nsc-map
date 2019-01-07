function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapDraggable from '@/components/MapDraggable';
import { Icon, Tooltip } from 'antd';
import styles from './MapToolbar.css';

class Toolbar extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "clickHandler", toolKey => {
      this.props.onChange(toolKey);
    });
  }

  render() {
    const {
      map,
      tools = [],
      activeToolKey,
      defaultPosition
    } = this.props;
    return React.createElement(MapDraggable, {
      map: map,
      defaultPosition: defaultPosition,
      direction: "vertical"
    }, tools.map((tool, index) => tool.render ? tool.render() : React.createElement("div", {
      key: index,
      className: activeToolKey === tool.key ? styles.activeTool : styles.tool,
      onClick: () => this.clickHandler(tool.key)
    }, React.createElement(Tooltip, {
      title: tool.label
    }, React.createElement(Icon, {
      type: tool.icon
    })))));
  }

}

Toolbar.propTypes = {
  tools: PropTypes.array.isRequired,
  // [{ icon, key, label, render }],
  activeToolKey: PropTypes.string,
  defaultPosition: PropTypes.object.isRequired,
  onChange: PropTypes.func
};
Toolbar.defaultProps = {
  defaultPosition: {
    x: 10,
    y: 10
  },
  onChange: toolKey => {}
};
export default Toolbar;