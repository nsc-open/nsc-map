import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MapDraggable from '@/components/MapDraggable'
import { Icon, Tooltip } from 'antd'
import styles from './MapToolbar.css'

class Toolbar extends Component {
  clickHandler = toolKey => {
    this.props.onChange(toolKey)
  }

  render () {
    const { map, tools = [], activeToolKey, defaultPosition } = this.props
    return (
      <MapDraggable map={map} defaultPosition={defaultPosition} direction="vertical">
      {tools.map((tool, index) => 
        tool.render
        ? tool.render()
        : <div
            key={index}
            className={activeToolKey === tool.key ? styles.activeTool : styles.tool}
            onClick={() => this.clickHandler(tool.key)}
          >
            <Tooltip title={tool.label}>
              <Icon type={tool.icon} />
            </Tooltip>
          </div> 
      )}
      </MapDraggable>
    )
  }
}

Toolbar.propTypes = {
  tools: PropTypes.array.isRequired, // [{ icon, key, label, render }],
  activeToolKey: PropTypes.string,
  defaultPosition: PropTypes.object.isRequired,
  onChange: PropTypes.func
}

Toolbar.defaultProps = {
  defaultPosition: { x: 10, y: 10 },
  onChange: (toolKey) => {}
}

export default Toolbar