/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio, Button, Row } from 'antd'
import Sketch from '../../../core/Sketch'

const { Button: RadioButton } = Radio
const ButtonGroup = Radio.Group

const DRAW_TOOLS = [
  { key: 'point', icon: 'rocket', label: '点' },
  { key: 'polyline', icon: 'usb', label: '线' },
  { key: 'polygon', icon: 'man', label: '多边形' }
]
const DEFAULT_TOOL = 'point'

class DrawOptionsBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeToolKey: DEFAULT_TOOL
    }
    this.sketch = null
  }

  componentDidMount () {
    const { view, beforeCompleteSketch: beforeComplete } = this.props
    this.sketch = new Sketch({ view }, { beforeComplete })
    this.createSketch()
  }

  componentWillUnmount () {
    this.sketch.destroy()
    this.sketch = null
  }

  createSketch (tool) {
    const { targetLayer } = this.props
    const { activeToolKey } = this.state
    tool = tool || activeToolKey

    this.sketch.create(
      typeof targetLayer === 'function' ? targetLayer(tool) : targetLayer,
      tool
    )
  }

  confirmHandler = () => {
    this.sketch.complete()
    this.createSketch()
  }

  cancelHandler = () => {
    this.sketch.cancel()
    this.createSketch()
  }

  toolChangeHandler = e => {
    const { value: tool } = e.target
    this.setState({ activeToolKey: tool })
    this.createSketch(tool)
  }

  render () {
    return (
      <div>
        绘制类型：
        <ButtonGroup defaultValue={DEFAULT_TOOL} buttonStyle="solid" onChange={this.toolChangeHandler} size="small">
          {DRAW_TOOLS.map(tool => 
            <RadioButton key={tool.key} icon={tool.icon} value={tool.key}>{tool.label}</RadioButton>
          )}
        </ButtonGroup>
        <Row type="flex" justify="end" style={{marginTop: '8px'}}>
          <Button onClick={this.confirmHandler} icon="check" type="primary" size="small" ghost style={{marginRight: '6px'}} />
          <Button onClick={this.cancelHandler} icon="close" size="small" type="danger" ghost />
        </Row>
      </div>
    )
  }
}

DrawOptionsBar.propTypes = {
  map: PropTypes.object,
  view: PropTypes.object,
  targetLayer: PropTypes.func.isRequired,
  beforeCompleteSketch: PropTypes.func
}

export default DrawOptionsBar