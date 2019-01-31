import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MapDraggable from '@/components/MapDraggable'
import { Icon, Tooltip } from 'antd'
import styles from './MapToolbar.css'

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