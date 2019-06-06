import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'
import Graphic from '../graphic/Graphic'

const createLayer = properties => {
  return loadModules(['esri/layers/GraphicsLayer']).then(({ GraphicsLayer }) => new GraphicsLayer(properties))
}

class GraphicsLayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layer: null,
      selectedKeys: [],
      editingKeys: []
    }
    this.hoverKeys = []
  }

  static getDerivedStateFromProps (props, prevState) {
    const { prevProps } = prevState
    const newState = { prevProps: props }
    const needSync = name => (!prevProps && name in props) || (prevProps && prevProps[name] !== props[name])

    // ================ selectedKeys =================
    if (props.selectable) {
      if (needSync('selectedKeys')) {
        newState.selectedKeys = props.selectedKeys
      }
    }

    // ================ editingKeys =================
    if (props.editable) {
      if (needSync('editingKeys')) {
        newState.editingKeys = props.editingKeys
      }
    }

    return newState
  }

  componentDidMount () {
    const { properties, map, onLoad } = this.props
    createLayer(properties).then(layer => {
      this.setState({ layer })
      map.add(layer)
      onLoad && onLoad(layer)
    })
  }

  componentWillUnmount () {
    this.props.map.remove(this.state.layer)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // only when layer is created, this component should be updated
    // or, this to ensure state.layer always has value in componentDidUpdate
    if (!nextState.layer) {
      return false
    } else {
      return true
    }
  }

  componentDidUpdate (prevProps) {
    const { properties } = this.props
    const { layer } = this.state
    const needSync = name => (!prevProps && name in this.props) || (prevProps && prevProps[name] !== this.props[name])

    // update graphicsLayer properties
    if (needSync('properties')) {
      layer.set(properties)
    }
  }

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = (state) => {
    let needSync = false
    const newState = {}

    Object.keys(state).forEach(name => {
      if (name in this.props) {
        return
      }
      needSync = true
      newState[name] = state[name]
    })

    if (needSync) {
      this.setState(newState)
    }
  }

  selectHandler = ({ key, selected, graphic, event }) => {
    const { onSelect } = this.props
    const { selectedKeys } = this.state
    let newSelectedKeys = []

    if (selected && !selectedKeys.includes(key)) {
      newSelectedKeys = [...selectedKeys, key]
    } else if (!selected) {
      newSelectedKeys = selectedKeys.filter(k => k !== key)
    }

    this.setUncontrolledState({ selectedKeys: newSelectedKeys })
    onSelect && onSelect(newSelectedKeys, { event, key, selected, graphic })
  }

  editHandler = event => {
    const { onEdit } = this.props
    onEdit && onEdit(event)
  }

  hoverHandler = event => {
    const { onHover, view, hoverCursor } = this.props
    const { key, hover } = event
    // TODO: this will have issue if there are more than one graphicsLayer, coz there is only one mapView at a time
    
    /* if (hover && !this.hoverKeys.includes(key)) {
      this.hoverKeys.push(key)
    } else if (!hover) {
      this.hoverKeys = this.hoverKeys.filter(k => k !== key)
    }
    if (this.hoverKeys.length > 0) {
      view.cursor = hoverCursor
    } else {
      view.cursor = 'auto'
    } */
    onHover && onHover(event)
  }

  render () {
    const { view, children = [], selectable, editable, hoverable, hoverCursor } = this.props
    const { layer, editingKeys, selectedKeys } = this.state
    
    if (layer) {
      return Children.map(children, child => {
        const graphicKey = Graphic.getKey(child.props)
        return React.cloneElement(child, {
          view,
          layer,

          selectable,
          selected: selectedKeys.includes(graphicKey),
          onSelect: this.selectHandler,

          editable,
          editing: editingKeys.includes(graphicKey),
          onEdit: this.editHandler,

          hoverable,
          hoverCursor,
          onHover: this.hoverHandler
        })
      })
    } else {
      return null
    }
  }
}

GraphicsLayer.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  properties: PropTypes.object,
  onLoad: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]), 

  selectable: PropTypes.bool.isRequired,
  selectedKeys: PropTypes.array,
  onSelect: PropTypes.func,

  hoverable: PropTypes.bool.isRequired,
  hoverCursor: PropTypes.string,
  onHover: PropTypes.func,

  editable: PropTypes.bool,
  editingKeys: PropTypes.array,
  onEdit: PropTypes.func
}

GraphicsLayer.defaultProps = {
  children: [],
  properties: null,
  selectable: true,
  hoverable: true,
  editable: true
}

export default GraphicsLayer