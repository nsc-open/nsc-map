/**
 * options for draw
 *  1. type selection: point, polyline, polygon, circle, etc
 *  2. symbol setting based on selected type
 */

import React, { Component } from 'react'
import { Radio, DatePicker, Row, Col } from 'antd'

const { Button } = Radio
const ButtonGroup = Radio.Group
const { RangePicker } = DatePicker

const EXPORT_TYPES = [
  { key: 'select', icon: 'rocket', label: '框选导出' },
  { key: 'time', icon: 'man', label: '时间范围导出' },
  { key: 'all', icon: 'usb', label: '全部导出' }
]

class ExportOptionsBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeToolKey: 'select'
    }
  }

  toolChangeHandler = (e) => {
    console.log(e)
    this.setState({ activeToolKey: e.target.value })
  }

  render () {
    const { activeToolKey } = this.state
    return (
      <div>
        导出方式：
        <ButtonGroup defaultValue="select" buttonStyle="solid" onChange={this.toolChangeHandler} size="small">
          {EXPORT_TYPES.map(tool => 
            <Button key={tool.key} icon={tool.icon} value={tool.key}>{tool.label}</Button>
          )}
        </ButtonGroup>
        
        {activeToolKey === 'time' ?
          <div style={{marginTop: '8px'}}>
            <RangePicker size="small" />
          </div>
        : null}
      </div>
    )
  }
}

export default ExportOptionsBar