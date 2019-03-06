import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio, Checkbox } from 'antd'
import GraphicSelectionManager from '../../../core/graphic-selection-manager/GraphicSelectionManager'

const { Button: RadioButton } = Radio
const ButtonGroup = Radio.Group

const SELECT_TOOLS = [
  { key: 'pointer', icon: '', label: '点选' },
  { key: 'box', icon: '', label: '框选' }
]
const DEFAULT_TOOL = 'pointer'

class SelectOptions extends Component {

  constructor (props) {
    super(props)
    this.state = {
      activeToolKey: DEFAULT_TOOL,
      enableMultiSelection: false
    }
    this.graphicSelectionManager = null
  }

  componentDidMount () {
    const { view, sourceLayers, onSelectionChange } = this.props
    this.graphicSelectionManager = new GraphicSelectionManager({ view, layers: sourceLayers })
    this.graphicSelectionManager.on('selectionChange', e => onSelectionChange(e))
    this.activateSelect()
  }

  componentWillUnmount () {
    this.graphicSelectionManager.destroy()
    this.graphicSelectionManager = null
  }

  activateSelect () {
    const { activeToolKey, enableMultiSelection } = this.state
    this.graphicSelectionManager.activate({
      type: activeToolKey,
      multiSelect: enableMultiSelection
    })
  }

  toolChangeHandler = e => {
    this.setState({
      activeToolKey: e.target.value
    }, () => this.activateSelect())
  }

  multiSelectChangeHandler = e => {
    this.setState({
      enableMultiSelection: e.target.checked
    }, () => this.activateSelect())
  }

  render () {
    const { enableMultiSelection } = this.state
    return (
      <div>
        选择方式：
        <ButtonGroup defaultValue={DEFAULT_TOOL} buttonStyle="solid" onChange={this.toolChangeHandler} size="small">
          {SELECT_TOOLS.map(tool => 
            <RadioButton key={tool.key} icon={tool.icon} value={tool.key} disabled={tool.key === 'box'}>{tool.label}</RadioButton>
          )}
        </ButtonGroup>
        <Checkbox disabled checked={enableMultiSelection} onChange={this.multiSelectChangeHandler} style={{marginLeft: '16px'}}>多选</Checkbox>
      </div>
    )
  }
}

SelectOptions.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  sourceLayers: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func
}

SelectOptions.defaultProps = {
  sourceLayers: [],
  onSelectionChange: () => {}
}

export default SelectOptions