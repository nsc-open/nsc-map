import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { loadModules } from 'esri-module-loader'

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
      layer: null, // need to put layer as state, so once layer is created, render would run again
    }
  }

  componentWillMount () {
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
    const { graphicsLayerProperties } = this.props
    const { layer } = this.state

    // update graphicsLayer properties
    if (graphicsLayerProperties !== prevProps.graphicsLayerProperties) {
      layer.set(graphicsLayerProperties)
    }
  }

  getGraphicKeys (graphics = []) {
    return graphics.map(g => g.attributes.key)
  }

  render () {
    console.log('GraphicsLayer render')
    const { children = [] } = this.props
    const { layer } = this.state

    if (layer) {
      const childProps = { layer } // pass graphicsLayer to direct children
      return Children.map(children, child => {
        return React.cloneElement(child, childProps)
      })
    } else {
      return null
    }
  }
}

GraphicsLayer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]), 
  graphicsLayerProperties: PropTypes.object,
  onLoad: PropTypes.func
}

GraphicsLayer.defaultProps = {
  children: [],
  graphicsLayerProperties: null,
  onLoad: layer => {}
}

export default GraphicsLayer