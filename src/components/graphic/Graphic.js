import { Component } from 'react'
import PropTypes from 'prop-types'
import StateManager from './state'

const KEY_ATTRIBUTE = 'key'

/**
 * usage:
 *  <GraphicsLayer>
      <Graphic key="" json={} />
      <Graphic key="" properties={} />
    </GraphicsLayer>
 */
class Graphic extends Component {
  constructor (props) {
    super(props)
    this.stateManager = null
  }

  componentDidMount () {
    const { view, layer, properties, json } = this.props
    this.stateManager = new StateManager({ view, layer })
    this.stateManager.init({ properties, json })
    this.stateManager.on('select', this.selectHandler)
    this.stateManager.on('hover', this.hoverHandler)
    this.stateManager.on('edit', this.editHandler)
  }

  componentWillUnmount () {
    this.stateManager.destroy()
    this.stateManager = null
  }

  componentDidUpdate (prevProps) {
    const { properties, json, selected, selectable, editing } = this.props
    const needSync = name => (!prevProps && name in this.props) || (prevProps && prevProps[name] !== this.props[name])
    
    // graphic instance create or update
    if (needSync('json') || needSync('properties')) {
      this.stateManager.update({ properties, json })
    }

    // process selected
    if (selectable) {
      if (needSync('selected') && selected) {
        this.stateManager.select()
      } else if (needSync('selected') && !selected) {
        this.stateManager.deselect()
      }
    }

    // edit
    if (needSync('editing')) {
      if (editing) {
        this.stateManager.edit()
      } else {
        this.stateManager.quitEdit()
      }
    }
  }

  selectHandler = ({ e, hit }) => {
    const { onSelect } = this.props
    onSelect && onSelect()
  }

  hoverHandler = ({ e, hit }) => {
    const { view, hoverable, hoverCursor = 'pointer', onHover } = this.props
    if (hoverable) {
      view.cursor = hit ? hoverCursor : 'auto'
      onHover && onHover()
    }
  }

  editHandler = ({ graphic, e }) => {
    const { onEdit } = this.props
    onEdit && onEdit({ graphic, e, key: Graphic.getKey({ properties: graphic }) })
  }

  render () {
    return null
  }
}

Graphic.propTypes = {
  // esri/Graphic constructor related props
  view: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  properties: PropTypes.object, // properties has higher priority than json when constructing a graphic
  json: PropTypes.object, // 

  hoverable: PropTypes.bool,
  hoverCursor: PropTypes.string,
  onHover: PropTypes.func,

  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,

  editable: PropTypes.bool,
  editing: PropTypes.bool,

  
}

Graphic.defaultProps = {
  properties: null,
  json: null,

  hoverable: true,
  hoverCursor: 'pointer',

  selectable: true,
  selected: false,

  editable: true,
  editing: false,

  onSelect: (e, { key, graphic, selected }) => {},
  onEdit: null // all sketch events will be dispatched here
}


Graphic.keyAttribute = KEY_ATTRIBUTE
Graphic.getKey = props => {
  const { attributes = {} } = props.properties || props.json
  return attributes.key
}

export default Graphic