import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'
import Graphic from '../graphic/Graphic'

const createLayer = properties => {
  return loadModules(['esri/layers/GraphicsLayer']).then(({ GraphicsLayer }) => new GraphicsLayer(properties))
}

/**
 * usage:
 *  <GraphicsLayer selectedKeys={[]}>
      <Graphic key="" highlight highlightSymbol={} geometryJson={} />
      <Graphic key="" graphicProperties={} />
    </GraphicsLayer>
 */
class GraphicsLayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layer: null,
      selectedKeys: [],
      editingKeys: []
    }
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
      onLoad(layer)
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

    console.log('needsync', needSync)
    if (needSync) {
      this.setState(newState)
    }
  }

  graphicSelectHandler = (e, { key, selected, graphic }) => {
    const { onSelect } = this.props
    const { selectedKeys } = this.state
    let newSelectedKeys = []

    if (selected && !selectedKeys.includes(key)) {
      newSelectedKeys = [...selectedKeys, key]
    } else if (!selected) {
      newSelectedKeys = selectedKeys.filter(k => k !== key)
    }

    this.setUncontrolledState({ selectedKeys: newSelectedKeys })
    onSelect && onSelect(newSelectedKeys, { event: e, key, selected, graphic })
  }

  render () {
    console.log('GraphicsLayer render', this)
    const { view, children = [] } = this.props
    const { layer, editingKeys, selectedKeys } = this.state
    
    if (layer) {
      return Children.map(children, child => {
        const graphicKey = Graphic.getKey(child.props)
        return React.cloneElement(child, {
          view,
          layer,
          selected: selectedKeys.includes(graphicKey),
          editing: editingKeys.includes(graphicKey),
          selectable: true,
          editable: true,
          onSelect: this.graphicSelectHandler
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

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]), 

  selectable: PropTypes.bool.isRequired,
  hoverable: PropTypes.bool.isRequired,
  selectedKeys: PropTypes.array,
  editingKeys: PropTypes.array,
  // hoverKeys: PropTypes.array // hover 是不需要 keys 去控制的，hover 一定是鼠标 hover 事件触发，不应该由外部去控制

  sketch: PropTypes.func,

  onLoad: PropTypes.func,
  onSelect: PropTypes.func,
  onHover: PropTypes.func
}

GraphicsLayer.defaultProps = {
  children: [],
  properties: null,

  selectable: true,
  hoverable: true,
  onLoad: layer => {},
  onSelect: () => {},
  onHover: () => {}
}

export default GraphicsLayer