/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio, Button } from 'antd'
import { getNamespace } from '../../../utils/InstanceManager'
import DistanceMeasurement from '../../../core/measurements/2d/DistanceMeasurement'
import AreaMeasurement from '../../../core/measurements/2d/AreaMeasurement'

const { Button: RadioButton } = Radio
const ButtonGroup = Radio.Group

const DRAW_TOOLS = [
  { key: 'distance', icon: 'rocket', label: '长度' },
  { key: 'area', icon: 'usb', label: '面积' },
  { key: 'angle', icon: 'man', label: '角度' }
]

class MeasureOptionsBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      view: null,
      activeToolKey: 'distance'
    }
    this.measurementTool = null
  }

  componentWillMount () {
    const { mapId } = this.props
    const viewInstanceNamespace = getNamespace('view')
    viewInstanceNamespace.get(mapId).then(view => {
      this.setState({ view })
    })
  }

  componentWillUnmount () {
    this.destroyTool()
  }

  componentDidUpdate () {
    const { view, activeToolKey } = this.state
    this.destroyTool()

    switch (activeToolKey) {
      case 'distance':
        this.measurementTool = new DistanceMeasurement({ view })
        break
      case 'area':
        this.measurementTool = new AreaMeasurement({ view })
        break
      case 'angle':
        break;
      default:
    }    
  }

  destroyTool () {
    if (this.measurementTool) {
      this.measurementTool.destroy()
      this.measurementTool = null
    }
  }

  clearMeasurement = () => {
    if (this.measurementTool) {
      this.measurementTool.clearMeasurement()
    }
  }

  newMeasurement = () => {
    if (this.measurementTool) {
      this.measurementTool.newMeasurement()
    }
  }

  toolChangeHandler = (e) => {
    this.setState({ activeToolKey: e.target.value })
  }

  render () {
    return (
      <div>
        测量类型：
        <ButtonGroup defaultValue="distance" buttonStyle="solid" onChange={this.toolChangeHandler} size="small">
          {DRAW_TOOLS.map(tool => 
            <RadioButton key={tool.key} icon={tool.icon} value={tool.key}>{tool.label}</RadioButton>
          )}
        </ButtonGroup>
        <div style={{marginTop:'4px'}}>
          <Button size="small" icon="rollback" onClick={this.newMeasurement}>重新测量</Button>
          <Button size="small" icon="close" onClick={this.clearMeasurement} style={{marginLeft:'8px'}} type="danger">清除</Button>
        </div>
      </div>
    )
  }
}

MeasureOptionsBar.propTypes = {
  mapId: PropTypes.string
}

MeasureOptionsBar.defaultProps = {
  mapId: 'default'
}

export default MeasureOptionsBar