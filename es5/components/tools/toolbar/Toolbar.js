function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapDraggable from '../../base/MapDraggable';
import MapWidget from '../../base/MapWidget';
import { Icon, Tooltip } from 'antd'; // import styles from './Toolbar.css'

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

const styles = {
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

class Toolbar extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "clickHandler", toolKey => {
      // this.props.onChange(toolKey)
      this.setState({
        activeToolKey: toolKey
      });
      console.log('select tool', toolKey);
    });

    this.state = {
      activeToolKey: ''
    };
  }

  render() {
    const {
      map,
      view,
      tools = [],
      defaultPosition
    } = this.props;
    const {
      activeToolKey
    } = this.state;
    const activeTool = tools.find(t => t.key === activeToolKey);
    return React.createElement("div", null, React.createElement(MapDraggable, {
      map: map,
      view: view,
      defaultPosition: defaultPosition
    }, React.createElement("div", null, tools.map((tool, index) => tool.render ? tool.render() : React.createElement("div", {
      key: index,
      style: activeToolKey === tool.key ? styles.activeTool : styles.tool,
      onClick: () => this.clickHandler(tool.key)
    }, React.createElement(Tooltip, {
      title: tool.label
    }, React.createElement(Icon, {
      type: tool.icon
    })))))), activeTool && activeTool.optionsBar ? React.createElement(MapWidget, {
      map: map,
      view: view,
      draggable: true
    }, activeTool.optionsBar) : null);
  }

}

Toolbar.propTypes = {
  tools: PropTypes.array.isRequired,
  // [{ icon, key, label, render, optionsBar }],
  activeToolKey: PropTypes.string,
  defaultPosition: PropTypes.object.isRequired,
  onChange: PropTypes.func
};
Toolbar.defaultProps = {
  defaultPosition: {
    x: 100,
    y: 15
  },
  onChange: toolKey => {}
};
export default Toolbar;