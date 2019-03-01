import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MapDraggable from '../../base/MapDraggable'
import MapWidget from '../../base/MapWidget'
import { Icon, Tooltip } from 'antd'
// import styles from './Toolbar.css'

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
}

class Toolbar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeToolKey: ''
    }
  }

  clickHandler = toolKey => {
    const { activeToolKey } = this.state

    if (activeToolKey !== toolKey) {
      this.setState({ activeToolKey: toolKey })
    } else {
      this.setState({ activeToolKey: '' })
    }
  }

  render () {
    const { map, view, tools = [], defaultPosition } = this.props
    const { activeToolKey } = this.state
    const activeTool = tools.find(t => t.key === activeToolKey)
    return (
      <div>
        <MapDraggable map={map} view={view} defaultPosition={defaultPosition}>
          <div>
            {tools.map((tool, index) => 
              tool.render
              ? tool.render()
              : <div
                  key={index}
                  style={activeToolKey === tool.key ? styles.activeTool : styles.tool}
                  onClick={() => this.clickHandler(tool.key)}
                >
                  <Tooltip title={tool.label}>
                    <Icon type={tool.icon} />
                  </Tooltip>
                </div> 
            )}
          </div>
        </MapDraggable>

        {activeTool && activeTool.optionsBar ?
          <MapWidget map={map} view={view} draggable>
            {activeTool.optionsBar}
          </MapWidget>
        : null}
      </div>
    )
  }
}

Toolbar.propTypes = {
  tools: PropTypes.array.isRequired, // [{ icon, key, label, render, optionsBar }],
  activeToolKey: PropTypes.string,
  defaultPosition: PropTypes.object.isRequired,
  onChange: PropTypes.func
}

Toolbar.defaultProps = {
  defaultPosition: { x: 100, y: 15 },
  onChange: (toolKey) => {}
}

export default Toolbar