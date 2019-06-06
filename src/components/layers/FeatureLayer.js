import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'
import Graphic from '../graphic/Graphic'

/**
 * usage:
 *  <FeatureLayer featureLayerProperties={}>
 *    <Graphic />
 *    <Graphic />
 *  </FeatureLayer>
 */
class FeatureLayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layer: null, // need to put layer as state, so once layer is created, render would run again
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
    loadModules([
      'FeatureLayer'
    ]).then(({ FeatureLayer }) => {
      const { properties, onLoad } = this.props
      const layer = new FeatureLayer(properties)

      this.addLayer(layer)
      this.setState({ layer }) 
      onLoad && onLoad(layer)
    })
  }

  componentWillUnmount () {
    this.removeLayer(this.state.layer)
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

  addLayer (layer) {
    const { map, parentLayer } = this.props
    if (parentLayer) {
      console.log('FeatureLayer parentLayer.add(layer)')
      parentLayer.add(layer)
    } else {
      console.log('FeatureLayer map.add(layer)')
      map.add(layer)
    }
  }

  removeLayer (layer) {
    const { map, parentLayer } = this.props
    if (parentLayer) {
      parentLayer.remove(layer)
    } else {
      map.remove(layer)
    }
  }

  selectHandler = ({ key, selected, graphic, event }) => {
    console.log('=-->', key, selected)
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
    const { onHover } = this.props
    onHover && onHover(event)
  }

  render () {
    const { view, children = [], selectable, editable, hoverable, hoverCursor } = this.props
    const { layer, editingKeys, selectedKeys } = this.state

    if (layer) {
      console.log('FeatureLayer render has layer', this)
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
      console.log('FeatureLayer render null')
      return null
    }
  }
}

FeatureLayer.propTypes = {
  map: PropTypes.object.isRequired,
  view: PropTypes.object.isRequired,
  parentLayer: PropTypes.object,
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

FeatureLayer.defaultProps = {
  children: [],
  properties: null,
  selectable: true,
  hoverable: true,
  editable: true
}

export default FeatureLayer