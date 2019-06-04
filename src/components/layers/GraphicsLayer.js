import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'
import Graphic from '../graphic/Graphic'

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
    const newState = {
      prevProps: props,
    }

    const needSync = name => (!prevProps && name in props) || (prevProps && prevProps[name] !== props[name])

    // ================ selectedKeys =================
    if (props.selectable) {
      if (needSync('selectedKeys')) {
        //newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props);
      } else if (!prevProps && props.defaultSelectedKeys) {
        //newState.selectedKeys = calcSelectedKeys(props.defaultSelectedKeys, props);
      }
    }

    return newState
  }

  componentDidMount () {
    loadModules([
      'esri/layers/GraphicsLayer'
    ]).then(({ GraphicsLayer }) => {
      const { map, onLoad } = this.props
      const layer = new GraphicsLayer()
      map.add(layer)
      this.setState({ layer })
      onLoad(layer)
    })
  }

  componentWillUnmount () {
    this.props.map.remove(this.state.layer)
  }

  componentDidUpdate (prevProps) {
    const { properties } = this.props
    const { layer } = this.state

    // update graphicsLayer properties
    if (properties !== prevProps.properties) {
      // layer.set(properties)
      // TODO
    }
  }

  graphicSelectHandler = (e, { key, selected, graphic }) => {
    console.log('select graphic', key, graphic, e)
    const { selectedKeys } = this.state
    if (selected) {
      !selectedKeys.includes(key) && this.setState({ selectedKeys: [...selectedKeys, key] })
    } else {
      this.setState({ selectedKeys: selectedKeys.filter(k => k !== key) })
    }
    
  }

  render () {
    console.log('GraphicsLayer render', this)
    const { view, children = [],  } = this.props
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